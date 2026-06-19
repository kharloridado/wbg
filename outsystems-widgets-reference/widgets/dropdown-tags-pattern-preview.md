# Dropdown Tags Pattern — Rendered HTML Reference

Source: The Loop Design System — Dropdown Tags pattern preview
State captured: OPEN with two tags selected ("Bridget Hernandez", "Camila Stevenson")

> Note: This widget uses a multi-select "virtual-select" component. The trigger
> (showing the selected tag chips) lives inside `.pattern-preview-content`, while
> the expanded dropdown (search box + checkbox options list) is rendered in the
> `.vscomp-ele` portal element. Both are included below for a complete reference.

## 1. Trigger markup (with tag chips) — `.pattern-preview-content`

```html
<div class="pattern-preview-content" id="b6-b7-b1-Preview">
  <div data-container="" class="OSInline" style="text-align: left; width: 100%; height: 100%;">
    <div data-block="Interaction.DropdownTags" class="OSBlockWidget" id="b6-b7-$b2">
      <div data-container="" class="osui-dropdown-tags pop-comp-ele vscomp-ele pop-comp-active" name="0.bcgrevbtqg5" id="b6-b7-b2-DropdownTags">
        <div id="vscomp-ele-wrapper-9334" class="vscomp-ele-wrapper vscomp-wrapper multiple has-select-all has-clear-button has-search-input show-value-as-tags text-direction-ltr popup-position-center focused has-value" tabindex="0" role="combobox" aria-haspopup="listbox" aria-controls="vscomp-dropbox-container-9334" aria-expanded="true" aria-label="Select one or more options" aria-activedescendant="vscomp-option-9334-2">
          <input type="hidden" name="0.bcgrevbtqg5" class="vscomp-hidden-input" value="5,41">
          <div class="vscomp-toggle-button">
            <div class="vscomp-value">
              <span class="vscomp-value-tag" data-index="0" data-value="5">
                <span class="vscomp-value-tag-content">Bridget Hernandez</span>
                <span class="vscomp-value-tag-clear-button" role="button" aria-label="Bridget Hernandez, Remove option" tabindex="0">
                  <i class="vscomp-clear-icon">
                  </i>
                </span>
              </span>
              <span class="vscomp-value-tag" data-index="2" data-value="41">
                <span class="vscomp-value-tag-content">Camila Stevenson</span>
                <span class="vscomp-value-tag-clear-button" role="button" aria-label="Camila Stevenson, Remove option" tabindex="0">
                  <i class="vscomp-clear-icon">
                  </i>
                </span>
              </span>
            </div>
            <div class="vscomp-arrow">
            </div>
            <div class="vscomp-clear-button toggle-button-child" data-tooltip="Clear" data-tooltip-enter-delay="200" data-tooltip-z-index="251" data-tooltip-font-size="14px" data-tooltip-alignment="center" data-tooltip-max-width="300px" data-tooltip-ellipsis-only="false" data-tooltip-allow-html="false" tabindex="0" role="button" aria-label="Clear button" aria-hidden="false">
              <i class="vscomp-clear-icon">
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

```

## 2. Full virtual-select widget (open, multi-select with checked options)

```html
<div data-container="" class="osui-dropdown-tags pop-comp-ele vscomp-ele pop-comp-active" name="0.bcgrevbtqg5" id="b6-b7-b2-DropdownTags">
  <div id="vscomp-ele-wrapper-9334" class="vscomp-ele-wrapper vscomp-wrapper multiple has-select-all has-clear-button has-search-input show-value-as-tags text-direction-ltr popup-position-center focused has-value" tabindex="0" role="combobox" aria-haspopup="listbox" aria-controls="vscomp-dropbox-container-9334" aria-expanded="true" aria-label="Select one or more options" aria-activedescendant="vscomp-option-9334-2">
    <input type="hidden" name="0.bcgrevbtqg5" class="vscomp-hidden-input" value="5,41">
    <div class="vscomp-toggle-button">
      <div class="vscomp-value">
        <span class="vscomp-value-tag" data-index="0" data-value="5">
          <span class="vscomp-value-tag-content">Bridget Hernandez</span>
          <span class="vscomp-value-tag-clear-button" role="button" aria-label="Bridget Hernandez, Remove option" tabindex="0">
            <i class="vscomp-clear-icon">
            </i>
          </span>
        </span>
        <span class="vscomp-value-tag" data-index="2" data-value="41">
          <span class="vscomp-value-tag-content">Camila Stevenson</span>
          <span class="vscomp-value-tag-clear-button" role="button" aria-label="Camila Stevenson, Remove option" tabindex="0">
            <i class="vscomp-clear-icon">
            </i>
          </span>
        </span>
      </div>
      <div class="vscomp-arrow">
      </div>
      <div class="vscomp-clear-button toggle-button-child" data-tooltip="Clear" data-tooltip-enter-delay="200" data-tooltip-z-index="251" data-tooltip-font-size="14px" data-tooltip-alignment="center" data-tooltip-max-width="300px" data-tooltip-ellipsis-only="false" data-tooltip-allow-html="false" tabindex="0" role="button" aria-label="Clear button" aria-hidden="false">
        <i class="vscomp-clear-icon">
        </i>
      </div>
    </div>
  </div>
</div>

```
