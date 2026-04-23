/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { apiPost } from '../composables/useApi';
const route = useRoute();
const token = route.query.token;
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref(null);
const success = ref(false);
async function handleSubmit() {
    error.value = null;
    if (password.value.length < 8) {
        error.value = 'Le mot de passe doit contenir au moins 8 caractères.';
        return;
    }
    if (password.value !== confirmPassword.value) {
        error.value = 'Les mots de passe ne correspondent pas.';
        return;
    }
    loading.value = true;
    const result = await apiPost('/api/v1/auth/reset-password', {
        token: token,
        new_password: password.value,
    });
    loading.value = false;
    if (!result.ok) {
        error.value = result.message;
        return;
    }
    success.value = true;
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
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
if (!__VLS_ctx.token) {
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
    Message;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        severity: "error",
        closable: (false),
    }));
    const __VLS_2 = __VLS_1({
        severity: "error",
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    // @ts-ignore
    [token,];
    var __VLS_3;
}
else if (__VLS_ctx.success) {
    let __VLS_6;
    /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
    Message;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        severity: "success",
        closable: (false),
    }));
    const __VLS_8 = __VLS_7({
        severity: "success",
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const { default: __VLS_11 } = __VLS_9.slots;
    // @ts-ignore
    [success,];
    var __VLS_9;
    let __VLS_12;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        to: "/login",
        ...{ class: "back-link" },
    }));
    const __VLS_14 = __VLS_13({
        to: "/login",
        ...{ class: "back-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {__VLS_StyleScopedClasses['back-link']} */ ;
    const { default: __VLS_17 } = __VLS_15.slots;
    // @ts-ignore
    [];
    var __VLS_15;
}
else {
    if (__VLS_ctx.error) {
        let __VLS_18;
        /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
        Message;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
            severity: "error",
            closable: (false),
            ...{ class: "msg" },
        }));
        const __VLS_20 = __VLS_19({
            severity: "error",
            closable: (false),
            ...{ class: "msg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        /** @type {__VLS_StyleScopedClasses['msg']} */ ;
        const { default: __VLS_23 } = __VLS_21.slots;
        (__VLS_ctx.error);
        // @ts-ignore
        [error, error,];
        var __VLS_21;
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
        for: "password",
    });
    let __VLS_24;
    /** @ts-ignore @type {typeof __VLS_components.Password} */
    Password;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        id: "password",
        modelValue: (__VLS_ctx.password),
        feedback: (false),
        toggleMask: true,
        required: true,
        fluid: true,
    }));
    const __VLS_26 = __VLS_25({
        id: "password",
        modelValue: (__VLS_ctx.password),
        feedback: (false),
        toggleMask: true,
        required: true,
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "confirmPassword",
    });
    let __VLS_29;
    /** @ts-ignore @type {typeof __VLS_components.Password} */
    Password;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        id: "confirmPassword",
        modelValue: (__VLS_ctx.confirmPassword),
        feedback: (false),
        toggleMask: true,
        required: true,
        fluid: true,
    }));
    const __VLS_31 = __VLS_30({
        id: "confirmPassword",
        modelValue: (__VLS_ctx.confirmPassword),
        feedback: (false),
        toggleMask: true,
        required: true,
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_34;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        type: "submit",
        label: "Réinitialiser",
        loading: (__VLS_ctx.loading),
        fluid: true,
    }));
    const __VLS_36 = __VLS_35({
        type: "submit",
        label: "Réinitialiser",
        loading: (__VLS_ctx.loading),
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
}
// @ts-ignore
[handleSubmit, password, confirmPassword, loading,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
