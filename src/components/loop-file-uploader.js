/**
 * <loop-file-uploader> — The Loop file uploader: drag-and-drop dropzone (default),
 * single-line input, or button — with a real <input type="file">, a per-file progress
 * list, and the five Figma states (enabled · disabled · success · warning · error).
 *
 * Figma: "File Uploader" [node:18306-3832] — dropzone [18306-3131], input [18306-3494],
 * button [23432-1891], progress rows [23069-31054]. Custom Web Component (L5): the native
 * OutSystems Upload widget ([data-upload]) is a single bordered label and cannot express
 * the dropzone, per-file progress, or state feedback. All design values come from the
 * --loop-upload-* tokens in tokens/component-upload.css (inherited custom props pierce the
 * Shadow DOM), so nothing is hard-coded here beyond fallbacks.
 *
 * Usage in OutSystems — drop the Block, bind the attributes, and wire the events to Client
 * Actions. The element wraps a working file input, so selection/drag-drop work client-side;
 * report real upload progress back with setProgress() from a "Run JavaScript" node.
 *
 * Attributes:
 *   variant       "dropzone" (default) | "input" | "button"
 *   size          "xlarge" (default) | "large" | "regular" | "small"  — aligns the label
 *                 size with sibling form controls (per Figma, only the label scales)
 *   state         "enabled" (default) | "disabled" | "success" | "warning" | "error"
 *                 Drives the border/fill/accent + the status line colour.
 *   label         The field label above the control ("Upload label").
 *   placeholder   Input variant only — placeholder text ("Placeholder text").
 *   button-label  Button variant only — label ("Upload Files").
 *   hint          Helper line below ("Formats supported: JPG, PDF (Max 10 MB)").
 *   status-text   The state message ("File uploaded successfully" / "Error uploading file. Try again").
 *                 Shown in the state accent colour; announced politely (assertive for error).
 *   accept        Passed to the file input (e.g. ".jpg,.pdf").
 *   multiple      Boolean — allow multiple files. Value-aware (absent → off; "true"/"" → on).
 *   disabled      Boolean — disables the control (forces the disabled visual). Value-aware.
 *
 * Public methods (callable from OutSystems / JS):
 *   open()                     open the OS file dialog (same as clicking the control)
 *   addFiles(fileListOrArray)  add files to the list programmatically
 *   setProgress(nameOrIndex, pct)  set a row's progress 0–100 (≥100 marks it uploaded)
 *   removeFile(nameOrIndex)    remove a row
 *   clear()                    drop all rows + reset the input
 *
 * Events (bubble, composed) — detail carries { id }:
 *   change  — files added/removed; detail.files = [{ name, size }]
 *   remove  — a row removed;       detail.name, detail.size
 *   browse  — the browse/button trigger was activated (before the dialog opens)
 *
 * Slots:
 *   icon — overrides the built-in file-arrow-up dropzone glyph.
 *
 * Accessibility: the control is a real <button>-semantics trigger wrapping a hidden input
 * (keyboard-operable, Enter/Space open the dialog); the label is associated via aria-label
 * and the hint via aria-describedby; the status line is a live region (role="status", or
 * "alert" for error). Focus ring uses the brand blue-50 (FND-012). prefers-reduced-motion
 * removes the drag-over transition. No brand colour is altered for contrast — conflicts are
 * raised as findings, not fixed here (CLAUDE.md the-one-rule).
 */
class LoopFileUploader extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'size', 'state', 'label', 'placeholder', 'button-label', 'hint', 'status-text', 'accept', 'multiple', 'disabled'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._files = [];                 // [{ name, size, pct }]
    this._onTrigger   = this._onTrigger.bind(this);
    this._onInput     = this._onInput.bind(this);
    this._onKey       = this._onKey.bind(this);
    this._onDragOver  = this._onDragOver.bind(this);
    this._onDragLeave = this._onDragLeave.bind(this);
    this._onDrop      = this._onDrop.bind(this);
  }

  connectedCallback() { this._render(); }

  disconnectedCallback() { this._teardownListeners(); }

  attributeChangedCallback(n, o, v) {
    if (o === v || !this.isConnected) return;
    this._render();
  }

  /* ---- attribute getters ---- */
  get _variant()     { const v = (this.getAttribute('variant') || '').toLowerCase(); return LoopFileUploader.VARIANTS.includes(v) ? v : 'dropzone'; }
  get _size()        { const s = (this.getAttribute('size') || '').toLowerCase(); return LoopFileUploader.SIZES.includes(s) ? s : 'xlarge'; }
  get _state()       { const s = (this.getAttribute('state') || '').toLowerCase(); return LoopFileUploader.STATES.includes(s) ? s : 'enabled'; }
  get _label()       { return this.getAttribute('label') || ''; }
  get _placeholder() { return this.getAttribute('placeholder') || 'Select a file'; }
  get _buttonLabel() { return this.getAttribute('button-label') || 'Upload Files'; }
  get _hint()        { return this.getAttribute('hint') || ''; }
  get _statusText()  { return this.getAttribute('status-text') || ''; }
  get _accept()      { return this.getAttribute('accept') || ''; }
  get _multiple()    { return this._boolAttr('multiple', false); }
  get _disabled()    { return this._boolAttr('disabled', false) || this._state === 'disabled'; }

  /* Value-aware boolean: ODC binds attrs with a forced value (If(Flag,"true","false")),
   * so presence-based hasAttribute() would read a bound "false" as true. See
   * web-component-boolean-attrs-odc. */
  _boolAttr(name, dflt) {
    const v = this.getAttribute(name);
    if (v === null) return dflt;
    return v !== 'false' && v !== '0';
  }

  /* ---- public API ---- */
  open() {
    if (this._disabled) return;
    this._emit('browse');
    this._input?.click();
  }
  addFiles(list) {
    const arr = Array.from(list || []);
    if (!arr.length) return;
    const next = arr.map((f) => ({ name: f.name, size: f.size, pct: 100 }));
    this._files = this._multiple ? this._files.concat(next) : next.slice(-1);
    this._renderFiles();
    this._emitChange();
  }
  setProgress(ref, pct) {
    const row = this._findFile(ref);
    if (!row) return;
    row.pct = Math.max(0, Math.min(100, Number(pct) || 0));
    this._renderFiles();
  }
  removeFile(ref) {
    const i = this._files.indexOf(this._findFile(ref));
    if (i === -1) return;
    const [gone] = this._files.splice(i, 1);
    this._renderFiles();
    this.dispatchEvent(new CustomEvent('remove', { bubbles: true, composed: true, detail: { id: this.id || null, name: gone.name, size: gone.size } }));
    this._emitChange();
  }
  clear() {
    this._files = [];
    if (this._input) this._input.value = '';
    this._renderFiles();
    this._emitChange();
  }

  _findFile(ref) {
    if (typeof ref === 'number') return this._files[ref];
    return this._files.find((f) => f.name === ref) || null;
  }
  _emit(name) { this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail: { id: this.id || null } })); }
  _emitChange() {
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { id: this.id || null, files: this._files.map((f) => ({ name: f.name, size: f.size })) } }));
  }

  /* ---- event handlers ---- */
  _onTrigger(e) { e.preventDefault(); this.open(); }
  _onKey(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.open(); } }
  _onInput(e) { this.addFiles(e.target.files); }
  _onDragOver(e) {
    if (this._disabled) return;
    e.preventDefault();
    this._zone?.classList.add('fu__zone--dragover');
  }
  _onDragLeave(e) {
    if (e.target === this._zone) this._zone?.classList.remove('fu__zone--dragover');
  }
  _onDrop(e) {
    if (this._disabled) return;
    e.preventDefault();
    this._zone?.classList.remove('fu__zone--dragover');
    if (e.dataTransfer?.files?.length) this.addFiles(e.dataTransfer.files);
  }

  _teardownListeners() {
    this._trigger?.removeEventListener('click', this._onTrigger);
    this._trigger?.removeEventListener('keydown', this._onKey);
    this._input?.removeEventListener('change', this._onInput);
    if (this._zone) {
      this._zone.removeEventListener('dragover', this._onDragOver);
      this._zone.removeEventListener('dragleave', this._onDragLeave);
      this._zone.removeEventListener('drop', this._onDrop);
    }
  }

  /* ---- Font Awesome 6 Pro glyphs (unicode against the document @font-face — visible
     inside shadow DOM, unlike .fa-* classes), currentColor ---- */
  _uploadGlyph() {
    return `<span class="fu__glyph" aria-hidden="true">&#xf574;</span>`;       /* fa-file-arrow-up (Figma dropzone icon) */
  }
  _arrowGlyph() {
    return `<span class="fu__btn-icon" aria-hidden="true">&#xf062;</span>`;    /* fa-arrow-up */
  }
  _infoGlyph() {
    return `<span class="fu__hint-icon" aria-hidden="true">&#xf05a;</span>`;   /* fa-circle-info */
  }

  _render() {
    const variant = this._variant;
    const state   = this._state;
    const label   = this._label;
    const hint    = this._hint;
    const status  = this._statusText;
    const disabled = this._disabled;
    const uid = this._uid || (this._uid = 'fu-' + Math.abs(this._hash(this.id || label || variant)) + '-' + this._files.length);
    const hintId = `${uid}-hint`;

    const labelHtml = label
      ? `<span class="fu__label" id="${uid}-label">${this._esc(label)}</span>` : '';
    const hintHtml = hint
      ? `<span class="fu__hint" id="${hintId}">${this._infoGlyph()}<span>${this._esc(hint)}</span></span>` : '';
    const statusHtml = status
      ? `<span class="fu__status" role="${state === 'error' ? 'alert' : 'status'}" aria-live="${state === 'error' ? 'assertive' : 'polite'}">${this._esc(status)}</span>` : '';

    const describedBy = [hint ? hintId : '', status ? '' : ''].filter(Boolean).join(' ');
    const ariaLabel = label || (variant === 'button' ? this._buttonLabel : 'Upload files');

    let control;
    if (variant === 'button') {
      control = `<button class="fu__btn" type="button" part="trigger"
                   aria-label="${this._esc(ariaLabel)}" ${describedBy ? `aria-describedby="${describedBy}"` : ''} ${disabled ? 'disabled' : ''}>
                   ${this._arrowGlyph()}<span>${this._esc(this._buttonLabel)}</span>
                 </button>`;
    } else if (variant === 'input') {
      control = `<button class="fu__input" type="button" part="trigger"
                   aria-label="${this._esc(ariaLabel)}" ${describedBy ? `aria-describedby="${describedBy}"` : ''} ${disabled ? 'disabled' : ''}>
                   <span class="fu__input-text">${this._esc(this._placeholder)}</span>
                   <span class="fu__input-icon">${this._arrowGlyph()}</span>
                 </button>`;
    } else {
      control = `<button class="fu__zone" type="button" part="trigger"
                   aria-label="${this._esc(ariaLabel)}" ${describedBy ? `aria-describedby="${describedBy}"` : ''} ${disabled ? 'disabled' : ''}>
                   <span class="fu__glyph-slot"><slot name="icon">${this._uploadGlyph()}</slot></span>
                   <span class="fu__prompt">Drag and drop files here or <span class="fu__browse">browse</span> computer files to upload.</span>
                 </button>`;
    }

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="fu fu--${variant} fu--${state} fu--size-${this._size}${disabled ? ' fu--disabled' : ''}" part="uploader">
        ${labelHtml}
        ${control}
        <input class="fu__input-file" type="file" ${this._accept ? `accept="${this._esc(this._accept)}"` : ''} ${this._multiple ? 'multiple' : ''} ${disabled ? 'disabled' : ''} tabindex="-1" aria-hidden="true">
        ${statusHtml}
        ${hintHtml}
        <ul class="fu__files" part="files"></ul>
      </div>`;

    this._teardownListeners();
    this._trigger = this.shadowRoot.querySelector('[part="trigger"]');
    this._input   = this.shadowRoot.querySelector('.fu__input-file');
    this._zone    = this.shadowRoot.querySelector('.fu__zone');
    this._list    = this.shadowRoot.querySelector('.fu__files');

    if (!disabled) {
      this._trigger?.addEventListener('click', this._onTrigger);
      this._input?.addEventListener('change', this._onInput);
      if (this._zone) {
        this._zone.addEventListener('dragover', this._onDragOver);
        this._zone.addEventListener('dragleave', this._onDragLeave);
        this._zone.addEventListener('drop', this._onDrop);
      }
    }
    this._renderFiles();
  }

  _renderFiles() {
    if (!this._list) return;
    this._list.innerHTML = this._files.map((f, i) => {
      const done = f.pct >= 100;
      return `<li class="fu__file${done ? ' fu__file--done' : ''}">
        <div class="fu__file-row">
          <span class="fu__file-name" title="${this._esc(f.name)}">${this._esc(f.name)}</span>
          <span class="fu__file-pct">${done ? '' : f.pct + '%'}</span>
          <button class="fu__file-remove" type="button" data-i="${i}" aria-label="Remove ${this._esc(f.name)}">
            <span class="fu__file-remove-glyph" aria-hidden="true">&#xf00d;</span>
          </button>
        </div>
        <div class="fu__progress" role="progressbar" aria-valuenow="${f.pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="fu__progress-fill" style="inline-size:${f.pct}%"></div>
        </div>
      </li>`;
    }).join('');
    this._list.querySelectorAll('.fu__file-remove').forEach((b) =>
      b.addEventListener('click', () => this.removeFile(Number(b.dataset.i))));
  }

  /* small helpers */
  _esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  _hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }

  _css() {
    return `
:host { display: block; }
*, *::before, *::after { box-sizing: border-box; }

/* the real file input is driven via the trigger button's .click(); keep it out of the
   layout but reachable (display:none still allows programmatic .click()). */
.fu__input-file { display: none; }

.fu {
  display: flex;
  flex-direction: column;
  gap: var(--loop-upload-label-gap, 6px);
  font-family: var(--font-family-body, "Open Sans", system-ui, sans-serif);
}

/* ---- Label ---- */
.fu__label {
  font-size:   var(--loop-upload-label-size, 16px);
  font-weight: var(--loop-upload-label-weight, 600);
  line-height: var(--loop-upload-label-leading, 16px);
  color:       var(--loop-upload-label-color, #000d1ab2);
}
.fu--size-regular .fu__label { font-size: 14px; }
.fu--size-small   .fu__label { font-size: 13px; }

/* ===================== Dropzone (default) ===================== */
.fu__zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--loop-upload-dropzone-gap, 16px);
  width: 100%;
  min-block-size: var(--loop-upload-dropzone-min-h, 179px);
  margin: 0;
  padding: var(--loop-upload-dropzone-pad, 24px);
  background: var(--loop-upload-enabled-bg, #f5f7f9);
  border: var(--loop-upload-border-width, 1px) dashed var(--loop-upload-enabled-border, #00538a);
  border-radius: var(--loop-upload-dropzone-radius, 4px);
  color: var(--loop-upload-enabled-icon, #004370);
  cursor: pointer;
  font: inherit;
  text-align: center;
  transition: border-color .15s ease, background-color .15s ease;
}
.fu__glyph-slot { display: inline-flex; }
/* FA file-arrow-up (regular) — 24px em box ≈ the 24px-tall file outline the Figma dropzone
   draws inside the 32px icon box */
.fu__glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--loop-upload-dropzone-icon-size, 32px);
  height: var(--loop-upload-dropzone-icon-size, 32px);
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-regular, 400);
  font-size: var(--loop-upload-dropzone-glyph, 24px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}
::slotted([slot="icon"]) { width: var(--loop-upload-dropzone-icon-size, 32px); height: var(--loop-upload-dropzone-icon-size, 32px); }

.fu__prompt {
  max-width: 230px;
  font-size:   var(--loop-upload-prompt-size, 14px);
  line-height: var(--loop-upload-prompt-leading, 1.5);
  color:       var(--loop-upload-prompt-color, #000d1ab2);
}
.fu__browse { color: var(--loop-upload-link-color, #004370); text-decoration: underline; }

.fu__zone.fu__zone--dragover { background: color-mix(in srgb, var(--loop-upload-enabled-border, #00538a) 8%, var(--loop-upload-enabled-bg, #f5f7f9)); }

/* ===================== Input (single line) ===================== */
.fu__input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--loop-upload-input-gap, 8px);
  width: 100%;
  margin: 0;
  padding: var(--loop-upload-input-pad-v, 18px) var(--loop-upload-input-pad-h, 16px);
  background: var(--color-bg-container-on-light-lowest, #fff);
  border: var(--loop-upload-border-width, 1px) solid var(--color-outline-on-light-default, #00396b3d);
  border-radius: var(--loop-upload-input-radius, 32px);
  color: var(--loop-upload-input-placeholder, #00294d91);
  cursor: pointer;
  font: inherit;
  text-align: start;
}
.fu__input-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fu__input-icon { display: inline-flex; flex-shrink: 0; color: var(--color-icon-on-light-default, #4b5e71); }
.fu__input-icon .fu__btn-icon {
  width: var(--loop-upload-input-icon, 20px);
  height: var(--loop-upload-input-icon, 20px);
  font-size: var(--loop-upload-input-glyph, 14px);
}

/* ===================== Button ===================== */
.fu__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--loop-upload-btn-gap, 6px);
  align-self: flex-start;
  margin: 0;
  padding: var(--loop-upload-btn-pad-v, 16px) var(--loop-upload-btn-pad-h, 32px);
  background: var(--color-bg-link-secondary-enabled, #ffffff00);
  border: var(--loop-upload-border-width, 1px) solid var(--loop-upload-btn-color, #004370);
  border-radius: var(--loop-upload-btn-radius, 32px);
  color: var(--loop-upload-btn-color, #004370);
  font-size:      var(--loop-upload-btn-label-size, 16px);
  font-weight:    var(--loop-upload-btn-label-weight, 700);
  line-height:    var(--loop-upload-btn-label-leading, 24px);
  letter-spacing: var(--loop-upload-btn-label-tracking, -0.5px);
  cursor: pointer;
}
/* FA arrow-up (regular) — 12px em box ≈ the ~10px arrow the Figma button draws in its 18px icon box */
.fu__btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--loop-upload-btn-icon, 18px);
  height: var(--loop-upload-btn-icon, 18px);
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-regular, 400);
  font-size: var(--loop-upload-btn-glyph, 12px);
  font-style: normal;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}

/* ===================== Per-state colour ===================== */
.fu--disabled .fu__zone,
.fu--disabled .fu__input,
.fu--disabled .fu__btn { cursor: not-allowed; }

.fu--disabled .fu__zone {
  background: var(--loop-upload-disabled-bg, #dae3eb);
  border-color: var(--loop-upload-disabled-border, #d4dee8);
  color: var(--loop-upload-disabled-icon, #8a9db1);
}
.fu--disabled .fu__prompt { color: var(--loop-upload-disabled-text, #00294d6b); }
.fu--disabled .fu__input,
.fu--disabled .fu__btn { border-color: var(--loop-upload-disabled-border, #d4dee8); color: var(--loop-upload-disabled-text, #00294d6b); }
.fu--disabled .fu__btn-icon,
.fu--disabled .fu__input-icon { color: var(--loop-upload-disabled-icon, #8a9db1); }

.fu--success .fu__zone { background: var(--loop-upload-success-bg, #f6fef0); border-color: var(--loop-upload-success-border, #388004); color: var(--loop-upload-success-accent, #388004); }
.fu--warning .fu__zone { background: var(--loop-upload-warning-bg, #fef3d7); border-color: var(--loop-upload-warning-border, #896001); color: var(--loop-upload-warning-accent, #473201); }
.fu--error   .fu__zone { background: var(--loop-upload-error-bg, #fdf2f2);   border-color: var(--loop-upload-error-border, #9d161d);   color: var(--loop-upload-error-accent, #9d161d); }

.fu--success .fu__input, .fu--success .fu__btn { border-color: var(--loop-upload-success-border, #388004); }
.fu--warning .fu__input, .fu--warning .fu__btn { border-color: var(--loop-upload-warning-border, #896001); }
.fu--error   .fu__input, .fu--error   .fu__btn { border-color: var(--loop-upload-error-border, #9d161d); }

/* ---- Status line (per-state accent) ---- */
.fu__status { font-size: var(--loop-upload-helper-size, 12px); letter-spacing: var(--loop-upload-helper-tracking, .5px); }
.fu--success .fu__status { color: var(--loop-upload-success-accent, #388004); }
.fu--warning .fu__status { color: var(--loop-upload-warning-accent, #473201); }
.fu--error   .fu__status { color: var(--loop-upload-error-accent, #9d161d); }
.fu--enabled .fu__status, .fu--disabled .fu__status { color: var(--loop-upload-helper-color, #00294d91); }

/* ---- Helper text ---- */
.fu__hint {
  display: inline-flex;
  align-items: center;
  gap: var(--loop-upload-helper-gap, 4px);
  font-size: var(--loop-upload-helper-size, 12px);
  letter-spacing: var(--loop-upload-helper-tracking, .5px);
  color: var(--loop-upload-helper-color, #00294d91);
}
/* FA circle-info (light) — hairline outline matching the Figma 1px-stroke 12px hint icon */
.fu__hint-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-light, 300);
  font-size: var(--loop-upload-hint-glyph, 11px);
  font-style: normal;
  line-height: 1;
  letter-spacing: 0;
  -webkit-font-smoothing: antialiased;
}

/* ---- File list + per-file progress ---- */
.fu__files { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--loop-upload-helper-gap, 4px); }
.fu__file { display: flex; flex-direction: column; gap: var(--space-tiny, 4px); }
.fu__file-row { display: flex; align-items: center; gap: var(--loop-upload-input-gap, 8px); }
.fu__file-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: var(--loop-upload-helper-size, 12px); color: var(--loop-upload-label-color, #000d1ab2); }
.fu__file-pct { flex-shrink: 0; font-size: var(--loop-upload-helper-size, 12px); color: var(--loop-upload-helper-color, #00294d91); }
.fu__file-remove { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; padding: 0; background: none; border: 0; color: var(--color-icon-on-light-default, #4b5e71); cursor: pointer; }
/* FA xmark (regular) — 14px em box renders the ~10px × the Figma 16px remove box draws */
.fu__file-remove-glyph {
  font-family: var(--font-family-icon, "Font Awesome 6 Pro");
  font-weight: var(--font-weight-icon-regular, 400);
  font-size: var(--loop-upload-remove-glyph, 14px);
  font-style: normal;
  line-height: 1;
  letter-spacing: 0;
  -webkit-font-smoothing: antialiased;
}

.fu__progress { block-size: var(--loop-upload-progress-h, 8px); background: var(--loop-upload-progress-track, #e7edf3); border-radius: var(--loop-upload-progress-radius, 32px); overflow: hidden; }
.fu__progress-fill { block-size: 100%; background: var(--loop-upload-progress-fill, #004370); border-radius: inherit; transition: inline-size .2s ease; }
.fu__file--done .fu__progress-fill { background: var(--loop-upload-success-accent, #388004); }

/* ---- Focus ring (brand blue-50, FND-012) ---- */
.fu__zone:focus-visible,
.fu__input:focus-visible,
.fu__btn:focus-visible,
.fu__file-remove:focus-visible {
  outline: 2px solid var(--loop-upload-focus, #0071bc);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .fu__zone, .fu__progress-fill { transition: none; }
}`;
  }
}

LoopFileUploader.VARIANTS = ['dropzone', 'input', 'button'];
LoopFileUploader.SIZES = ['xlarge', 'large', 'regular', 'small'];
LoopFileUploader.STATES = ['enabled', 'disabled', 'success', 'warning', 'error'];

if (!customElements.get('loop-file-uploader')) {
  customElements.define('loop-file-uploader', LoopFileUploader);
}
