# AI IDE Master Prompt

You are a senior staff software engineer and open-source maintainer.

Your goal is to transform the SopKit repository into a production-grade monorepo containing reusable NPM packages, documentation, automated publishing, and website integration.

## Requirements

* Use TypeScript throughout.
* Use Turborepo + pnpm workspaces.
* Organize packages under the `@sopkit/*` scope.
* Keep the existing website fully functional.
* Do not introduce breaking changes.
* Reuse website business logic wherever possible.

## Monorepo Structure

Create:

* apps/web (existing website)
* apps/docs
* packages/*
* packages/config
* packages/eslint-config
* packages/typescript-config
* packages/ui
* packages/utils
* scripts
* examples

## Package Generation

Extract reusable logic from the website into standalone packages.

Examples:

* @sopkit/base64
* @sopkit/json
* @sopkit/hash
* @sopkit/password
* @sopkit/color
* @sopkit/uuid
* @sopkit/date
* @sopkit/image
* @sopkit/pdf
* @sopkit/qrcode
* @sopkit/barcode
* @sopkit/slug
* @sopkit/xml
* @sopkit/yaml
* @sopkit/csv
* @sopkit/markdown
* @sopkit/html
* @sopkit/url
* @sopkit/jwt
* @sopkit/validator

Each package must include:

* Complete TypeScript source
* ESM and CommonJS builds
* Tree shaking
* Zero unnecessary dependencies
* Typed API
* Unit tests with Vitest
* README.md
* CHANGELOG.md
* LICENSE
* package.json
* tsup build configuration
* API documentation
* Usage examples
* Browser compatibility
* Node compatibility

## Quality

Every exported function must have:

* TSDoc comments
* Examples
* Edge-case handling
* Input validation
* Excellent error messages
* 100% TypeScript types

## Documentation

Create a documentation site with:

* Installation
* API reference
* Examples
* Playground
* Changelog
* Search
* Dark mode

## Website Integration

Every tool page must automatically display:

* Install with npm:
  `npm install @sopkit/<package>`
* Import examples
* Live code examples
* API documentation
* GitHub source link
* Copy install button
* Related packages
* Playground

The website should detect whether a tool has a corresponding package and render these sections automatically.

## Publishing

Configure GitHub Actions to:

* Run lint
* Run tests
* Build packages
* Verify types
* Generate documentation
* Publish changed packages to npm using Changesets
* Create GitHub Releases automatically
* Generate release notes
* Publish documentation after successful releases

## Developer Experience

Configure:

* Changesets
* ESLint
* Prettier
* Husky
* lint-staged
* Conventional Commits
* Commitlint
* Renovate
* Dependabot

## Examples

Create runnable examples for Node.js, React, Next.js, Vue, Svelte, and browser CDN usage where applicable.

## Performance

* Minimize bundle sizes.
* Support tree shaking.
* Avoid duplicate dependencies.
* Benchmark critical functions.
* Add performance tests for computational utilities.

## Deliverables

Produce production-ready code only. Do not leave placeholders or TODOs. Preserve existing functionality while progressively extracting reusable modules. Ensure every package can be independently published under the `@sopkit` organization and that the website automatically surfaces package installation, documentation, and examples for every supported tool.
