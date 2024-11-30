/**
 * @param {string} param
 * @return {param is (Integer && length == 4)}
 * @satisfies {import('@sveltejs/kit').ParamMatcher}
 */
export function match(param) {
    return Number.isInteger(Number(param)) && param.length == 4;
}