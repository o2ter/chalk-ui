# AI Coding Agent Instructions

## Project Overview
`@o2ter/chalk-ui` is a React UI component library built on the **Frosty framework** (JSX import source). It uses a sophisticated multi-platform build system that generates separate bundles for `.native`, `.server`, and `.web` platforms using module suffixes in Rollup.

## Architecture & Key Patterns

### Multi-Platform Component Resolution
- Components use platform-specific file suffixes (`.native.tsx`, `.web.tsx`, `.server.tsx`)
- Rollup config generates separate bundles: `index.js`/`index.mjs`, `index.native.js`, `index.web.js`, `index.server.js`
- TypeScript config uses `jsxImportSource: "frosty"` instead of React

### Component Organization Pattern
- **Namespace Components**: Use `_.assign()` pattern like `Form.Group`, `Form.Consumer` (see `src/components/Form/index.ts`)
- **Context-Driven Architecture**: Each component family has dual contexts:
  - Public context (`FormContext`) - exposed state and actions
  - Internal context (`FormInternalContext`) - internal utilities like error management
- **Hierarchical State**: Components like `FormGroup` create nested path contexts using lodash `_.toPath()`

### Hook Patterns
- **Composite Hooks**: `useForm()` combines context + group path; `useField()` handles validation + error state
- **Path-Based State**: Form fields use dot-notation paths (`user.profile.name`) with lodash path utilities
- **Validator Integration**: `useField().useValidator()` for async validation with cleanup

## Development Workflow

### Build Commands
- `yarn rollup` - Clean and build all platform variants
- `yarn start` - Dev server using Frosty's development server for `tests/server/app.tsx`
- `yarn test` - Jest with TypeScript preset

### File Structure Rules
- All exports flow through cascade: `src/index.ts` → `src/components/index.ts` → `src/components/Form/index.ts`
- Each component directory has: `index.tsx` (component), `context.ts` (state), `types.ts` (TypeScript)

## Frosty Framework Specifics
- Import hooks from `'frosty'`, not `'react'`
- Use `ElementNode` type instead of `ReactNode`
- Component props use `PropsWithChildren<T>` pattern
- Always verify Frosty-specific APIs. Do not assume React patterns apply directly.

## Code Conventions
- **Lodash Heavy**: Extensive use of `_.assign`, `_.toPath`, `_.get`, `_.compact` throughout
- **MIT License Headers**: All source files include full MIT license header (see existing files)
- **State Management**: Prefer context + hooks over external state libraries

## Dependencies
- **Core**: `frosty`, `frosty-native`, `lodash` 
- **Build**: Rollup with TypeScript, Babel, SCSS support
- **Platform Detection**: Module suffix resolution for cross-platform components

## Testing & Development
- Test server at `tests/server/app.tsx` - minimal Frosty app for component testing
- **Temporary Files for Testing**: When creating temporary files to test code, place all test scripts under `<project_root>/.temp/` to keep the workspace organized and avoid conflicts with the main codebase.
