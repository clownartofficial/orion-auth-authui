/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiPost } from '../composables/useApi';
import { useAuthState } from '../composables/useAuthState';
import { useSettings } from '../composables/useSettings';
const router = useRouter();
const { state, updateFromLoginResponse } = useAuthState();
const { registrationEnabled, fetchSettings } = useSettings();
onMounted(fetchSettings);
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);
async function handleSubmit() {
    error.value = null;
    loading.value = true;
    const result = await apiPost('/authorize/login', {
        request_id: state.requestId,
        email: email.value,
        password: password.value,
    });
    loading.value = false;
    if (!result.ok) {
        if (result.status === 401) {
            error.value = 'Email ou mot de passe incorrect.';
        }
        else if (result.status === 403) {
            error.value = 'Votre compte est verrouillé. Veuillez contacter le support.';
        }
        else {
            error.value = result.message;
        }
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
    if (data.requires_mfa) {
        updateFromLoginResponse(data);
        router.push('/mfa');
        return;
    }
    if (data.requires_consent) {
        updateFromLoginResponse(data);
        router.push('/consent');
        return;
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['links']} */ ;
/** @type {__VLS_StyleScopedClasses['links']} */ ;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
    ...{ class: "form" },
});
/** @type {__VLS_StyleScopedClasses['form']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "field" },
});
/** @type {__VLS_StyleScopedClasses['field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "email",
});
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.InputText} */
InputText;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    id: "email",
    modelValue: (__VLS_ctx.email),
    type: "email",
    placeholder: "vous@exemple.com",
    required: true,
    fluid: true,
}));
const __VLS_8 = __VLS_7({
    id: "email",
    modelValue: (__VLS_ctx.email),
    type: "email",
    placeholder: "vous@exemple.com",
    required: true,
    fluid: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "field" },
});
/** @type {__VLS_StyleScopedClasses['field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "password",
});
let __VLS_11;
/** @ts-ignore @type {typeof __VLS_components.Password} */
Password;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    id: "password",
    modelValue: (__VLS_ctx.password),
    feedback: (false),
    toggleMask: true,
    required: true,
    fluid: true,
}));
const __VLS_13 = __VLS_12({
    id: "password",
    modelValue: (__VLS_ctx.password),
    feedback: (false),
    toggleMask: true,
    required: true,
    fluid: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_16;
/** @ts-ignore @type {typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    type: "submit",
    label: "Se connecter",
    loading: (__VLS_ctx.loading),
    fluid: true,
}));
const __VLS_18 = __VLS_17({
    type: "submit",
    label: "Se connecter",
    loading: (__VLS_ctx.loading),
    fluid: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "links" },
});
/** @type {__VLS_StyleScopedClasses['links']} */ ;
let __VLS_21;
/** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
RouterLink;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    to: "/forgot-password",
}));
const __VLS_23 = __VLS_22({
    to: "/forgot-password",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
// @ts-ignore
[handleSubmit, email, password, loading,];
var __VLS_24;
if (__VLS_ctx.registrationEnabled !== false) {
    let __VLS_27;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        to: "/register",
    }));
    const __VLS_29 = __VLS_28({
        to: "/register",
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    const { default: __VLS_32 } = __VLS_30.slots;
    // @ts-ignore
    [registrationEnabled,];
    var __VLS_30;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
