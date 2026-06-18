## Key Outcomes

OutSystems will build a **Loop design system lifestyle guide** and 3-5 high-fidelity common page templates by **July 1st**, with Helena handling UX design and Kharlo implementing front-end components . The engagement establishes foundational reusable components, with additional patterns to be added during the upcoming HR case management project and future work .
## Decisions Made

- **Source of truth:** Main library is the primary design source; UI Kit will contain external web-specific components only 
- **Design token updates:** Manual process required—World Bank team will extract tokens as files and notify OutSystems of changes for CSS variable updates 
- **Access approach:** World Bank team will create Figma branches for Helena to access variables and component information 
- **Scope prioritization:** Focus on 3-5 most critical common pages now; additional components added iteratively post-July 1st 

## Project Structure

**Phase 1: Lifestyle Guide Development (Kharlo)**
- Clone Lyft lifestyle guide and adapt for Loop design system compliance 
- Start implementation on Day 1 (Wednesday) pending Figma access 
- Build custom components not available in OutSystems UI as prioritized 

**Phase 2: High-Fidelity Design (Helena)**
- Design 3-5 prioritized common pages from Loop common pages collection 
- 8-hour focused design session scheduled for Friday 
- Work in World Bank Figma branch with linked components 

**Phase 3: Component Implementation**
- Kharlo builds out designed screens as reusable front-end components 
- Components stored in OutSystems for quick screen assembly 

## Pending Confirmation

- **ODC tenant access:** Jessica to provide Kharlo dev and test environment access (not Figma-related) 
- **Team access:** Jessica to coordinate OutSystems platform access for World Bank design team 
- **Common page selection:** World Bank team must finalize 3-5 priority screens by end of day Wednesday 
- **Component mapping:** Maria to complete Lyft vs Loop comparison table showing size differences (e.g., extra-large for external web), missing components (cards, blank slate), and gaps 
- **Pattern finalization:** Header, footer, and navigation patterns still under adjustment 

## Blockers Requiring Action

- **Foundational token changes:** World Bank may need to update typography and primary colors in Loop, creating hesitance to move quickly 
- **Timeline pressure:** 3-day window to identify priority screens before Helena's Friday design sprint 

## Action Items

- **Patrick:** Email Jessica about ODC dev/test access for Kharlo and platform access for World Bank team (immediately after meeting) 
- **Kharlo:** Provide OutSystems platform demo during Wednesday daily sync—show component creation, drag-and-drop, and environment overview 
- **Maria/World Bank team:** Finalize 3-5 priority common pages by end of day Wednesday 
- **Maria:** Share Lyft vs Loop component mapping document flagging differences in sizes, missing components, and gaps 
- **World Bank team:** Provide all available Figma files for Lyft design system 
- **Maria:** Create Figma branch for Helena with variable and component access 

## Prerequisites Status

- ✅ **Lyft Lifestyle Guide:** OutSystems has Step Lyft style guide 
- ✅ **Loop assets:** Main library and common pages already shared with Helena and Kharlo 
- ⏳ **Figma access:** Pending for Kharlo to inspect widgets and ensure development accuracy 
- ⏳ **ODC access:** Dev and test environment access needed for Kharlo 

## Process & Governance

**Change management for design tokens:**
- Structural and functionality changes are complex; CSS-layer changes (fonts, colors) are straightforward 
- World Bank extracts token files; OutSystems updates CSS variables manually 
- Single switch update for foundational tokens propagates to all components 

**Ongoing componentization:**
- Post-July 1st: Additional components added during HR case management engagement 
- Establish feedback loop for nominating frequently-used screens for componentization 
- Project-specific components built to be reusable and added to lifestyle guide 

## HR Case Management Context

OutSystems building proof-of-concept case management application for HR pension teams with custom front-end components (screen pops, call queues, widgets) . Original plan to use Lyft lifestyle guide shifted to Loop-based approach, with lifestyle guide work feeding into case management build . Additional UX/UI time during HR engagement can revisit generic corporate solution screens and build more generic front-end components .
## Team Introductions

**OutSystems:**
- Patrick Day: Solution Delivery Manager, Boston—handles World Bank services 
- Helena: UX Designer, Portugal—leading experience practice at OutSystems Professional Services 
- Kharlo Ridado: Front-end developer, New York—working with Helena 

**World Bank:**
- Maria Velez: Leading design system initiative 
- Borislav (Bobby): UX Designer, Sofia—working on header/footer/navigation patterns 
- Deyan: UX Designer, Sofia 

## Daily Syncs

- 30-minute daily cadence established for Kharlo and World Bank team 
- Wednesday sync: Maria to demo high-level Lyft vs Loop differences 
- Format allows quick context-sharing and component prioritization discussions 
