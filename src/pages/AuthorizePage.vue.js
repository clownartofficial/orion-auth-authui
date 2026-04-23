/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiGet } from '../composables/useApi';
import { useAuthState } from '../composables/useAuthState';
const route = useRoute();
const router = useRouter();
const { setFromAuthorizeResponse } = useAuthState();
const loading = ref(true);
const error = ref(null);
onMounted(async () => {
    const params = {};
    const keys = ['client_id', 'redirect_uri', 'response_type', 'scope', 'state', 'code_challenge', 'code_challenge_method', 'nonce'];
    for (const key of keys) {
        const value = route.query[key];
        if (typeof value === 'string') {
            params[key] = value;
        }
    }
    if (!params.client_id || !params.redirect_uri || !params.response_type) {
        error.value = 'Paramètres OAuth2 manquants.';
        loading.value = false;
        return;
    }
    const result = await apiGet('/authorize', params);
    if (!result.ok) {
        error.value = result.message;
        loading.value = false;
        return;
    }
    setFromAuthorizeResponse(result.data);
    if (result.data.requires_login) {
        router.push('/login');
    }
    else if (result.data.requires_consent) {
        router.push('/consent');
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page" },
});
/** @type {__VLS_StyleScopedClasses['page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content" },
});
/** @type {__VLS_StyleScopedClasses['content']} */ ;
if (__VLS_ctx.loading && !__VLS_ctx.error) {
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.ProgressSpinner} */
    ProgressSpinner;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
if (__VLS_ctx.error) {
    let __VLS_5;
    /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
    Message;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        severity: "error",
        closable: (false),
    }));
    const __VLS_7 = __VLS_6({
        severity: "error",
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_10 } = __VLS_8.slots;
    (__VLS_ctx.error);
    // @ts-ignore
    [loading, error, error, error,];
    var __VLS_8;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
