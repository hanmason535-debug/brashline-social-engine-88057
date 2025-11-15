# Bugfix: Responsive sizes attribute for two-item arrays

- Component: `src/lib/utils.ts` → `generateSizesAttribute`
- Root cause: For arrays with exactly two sizes, the function constructed three media queries (including an unnecessary 1024px breakpoint), resulting in redundant output.
- Fix: Handle the two-item case explicitly by returning `"(max-width: 640px) <min>px, <max>px"`.
- Regression invariant: A new unit test asserts that `[300, 800]` yields `"(max-width: 640px) 300px, 800px"` and that size arrays are sorted prior to generating queries.
- Scope: No behavior changes for 0, 1, or 3+ lengths; performance unaffected.

## Test References
- `src/lib/utils.test.ts` → two-item array regression case
- Additional utils tests cover empty, single, and 3+ sizes, plus unsorted inputs

## Notes
- This logic keeps breakpoints intentional and avoids over-specifying media queries for simple two-size sets.
