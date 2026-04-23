/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import { apiPost } from '../composables/useApi';
import { useAuthState } from '../composables/useAuthState';
const scopeDescriptions = {
    openid: 'Vérifier votre identité',
    profile: 'Accéder à votre nom et photo de profil',
    email: 'Voir votre adresse e-mail',
    offline_access: 'Rester connecté en votre nom',
};
const { state } = useAuthState();
const uniqueScopes = [...new Set(state.requestedScopes)];
const loading = ref(false);
const error = ref(null);
async function handleApprove() {
    error.value = null;
    loading.value = true;
    const result = await apiPost('/authorize/consent', {
        request_id: state.requestId,
        scopes_granted: uniqueScopes,
    });
    loading.value = false;
    if (!result.ok) {
        error.value = result.message;
        return;
    }
    const data = result.data;
    const url = new URL(data.redirect_uri);
    url.searchParams.set('code', data.code);
    if (data.state)
        url.searchParams.set('state', data.state);
    window.location.href = url.toString();
}
function handleDeny() {
    window.history.back();
}
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
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "page-title" },
});
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "page-sub" },
});
/** @type {__VLS_StyleScopedClasses['page-sub']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "page-desc" },
});
/** @type {__VLS_StyleScopedClasses['page-desc']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
(__VLS_ctx.state.clientName);
if (__VLS_ctx.error) {
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
    Message;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        severity: "error",
        closable: (false),
        ...{ class: "msg" },
    }));
    const __VLS_2 = __VLS_1({
        severity: "error",
        closable: (false),
        ...{ class: "msg" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['msg']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    (__VLS_ctx.error);
    // @ts-ignore
    [state, error, error,];
    var __VLS_3;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
    ...{ class: "scopes" },
});
/** @type {__VLS_StyleScopedClasses['scopes']} */ ;
for (const [scope] of __VLS_vFor((__VLS_ctx.uniqueScopes))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
        key: (scope),
        ...{ class: "scope-item" },
    });
    /** @type {__VLS_StyleScopedClasses['scope-item']} */ ;
    (__VLS_ctx.scopeDescriptions[scope] || scope);
    // @ts-ignore
    [uniqueScopes, scopeDescriptions,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "actions" },
});
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onClick': {} },
    label: "Refuser",
    severity: "secondary",
    outlined: true,
    disabled: (__VLS_ctx.loading),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onClick': {} },
    label: "Refuser",
    severity: "secondary",
    outlined: true,
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = ({ click: {} },
    { onClick: (__VLS_ctx.handleDeny) });
var __VLS_9;
var __VLS_10;
let __VLS_13;
/** @ts-ignore @type {typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
    label: "Autoriser",
    loading: (__VLS_ctx.loading),
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
    label: "Autoriser",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = ({ click: {} },
    { onClick: (__VLS_ctx.handleApprove) });
var __VLS_16;
var __VLS_17;
// @ts-ignore
[loading, loading, handleDeny, handleApprove,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
