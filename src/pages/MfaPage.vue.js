/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { apiPost } from '../composables/useApi';
import { useAuthState } from '../composables/useAuthState';
const router = useRouter();
const { state, updateFromLoginResponse } = useAuthState();
const code = ref('');
const loading = ref(false);
const error = ref(null);
watch(code, (val) => {
    if (val.length === 6) {
        handleSubmit();
    }
});
async function handleSubmit() {
    error.value = null;
    loading.value = true;
    const result = await apiPost('/authorize/mfa', {
        request_id: state.requestId,
        code: code.value,
    });
    loading.value = false;
    if (!result.ok) {
        if (result.status === 403) {
            error.value = 'Code invalide. Veuillez réessayer.';
        }
        else {
            error.value = result.message;
        }
        code.value = '';
        return;
    }
    const data = result.data;
    if (data.redirect_uri && data.code) {
        const url = new URL(data.redirect_uri);
        url.searchParams.set('code', data.code);
        if (data.state)
            url.searchParams.set('state', data.state);
        window.location.href = url.toString();
        return;
    }
    if (data.requires_consent) {
        updateFromLoginResponse(data);
        router.push('/consent');
    }
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
    [error, error,];
    var __VLS_3;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "otp-container" },
});
/** @type {__VLS_StyleScopedClasses['otp-container']} */ ;
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.InputOtp} */
InputOtp;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    modelValue: (__VLS_ctx.code),
    length: (6),
    integerOnly: true,
    disabled: (__VLS_ctx.loading),
}));
const __VLS_8 = __VLS_7({
    modelValue: (__VLS_ctx.code),
    length: (6),
    integerOnly: true,
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
/** @ts-ignore @type {typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    ...{ 'onClick': {} },
    label: "Vérifier",
    loading: (__VLS_ctx.loading),
    disabled: (__VLS_ctx.code.length !== 6),
    fluid: true,
}));
const __VLS_13 = __VLS_12({
    ...{ 'onClick': {} },
    label: "Vérifier",
    loading: (__VLS_ctx.loading),
    disabled: (__VLS_ctx.code.length !== 6),
    fluid: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_16;
const __VLS_17 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSubmit) });
var __VLS_14;
var __VLS_15;
// @ts-ignore
[code, code, loading, loading, handleSubmit,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
