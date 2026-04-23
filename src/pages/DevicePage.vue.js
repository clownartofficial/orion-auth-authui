/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { apiPost } from '../composables/useApi';
const route = useRoute();
const scopeDescriptions = {
    openid: 'Vérifier votre identité',
    profile: 'Accéder à votre nom et photo de profil',
    email: 'Voir votre adresse e-mail',
    offline_access: 'Rester connecté en votre nom',
};
const step = ref('code');
const userCode = ref('');
const clientName = ref('');
const scopes = ref([]);
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);
const resultMessage = ref('');
const resultSeverity = ref('success');
async function handleVerify() {
    error.value = null;
    loading.value = true;
    const result = await apiPost('/device/verify', {
        user_code: userCode.value,
    });
    loading.value = false;
    if (!result.ok) {
        error.value = result.status === 400 ? 'Code invalide ou expiré.' : result.message;
        return;
    }
    clientName.value = result.data.client_name;
    scopes.value = result.data.scopes;
    step.value = 'approve';
}
async function handleApprove(approved) {
    error.value = null;
    if (approved && (!email.value || !password.value)) {
        error.value = 'Veuillez renseigner votre email et mot de passe.';
        return;
    }
    loading.value = true;
    const result = await apiPost('/device/approve', {
        user_code: userCode.value,
        approved,
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
    if (approved) {
        resultMessage.value = 'Appareil autorisé. Vous pouvez fermer cette page.';
        resultSeverity.value = 'success';
    }
    else {
        resultMessage.value = 'Autorisation refusée.';
        resultSeverity.value = 'info';
    }
    step.value = 'done';
}
onMounted(() => {
    const code = route.query.code;
    if (typeof code === 'string' && code.length > 0) {
        userCode.value = code;
        handleVerify();
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page" },
});
/** @type {__VLS_StyleScopedClasses['page']} */ ;
if (__VLS_ctx.step === 'code') {
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
        [step, error, error,];
        var __VLS_3;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
        ...{ onSubmit: (__VLS_ctx.handleVerify) },
        ...{ class: "form" },
    });
    /** @type {__VLS_StyleScopedClasses['form']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "user-code",
    });
    let __VLS_6;
    /** @ts-ignore @type {typeof __VLS_components.InputText} */
    InputText;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        id: "user-code",
        modelValue: (__VLS_ctx.userCode),
        placeholder: "XXXX-XXXX",
        required: true,
        fluid: true,
        ...{ class: "code-input" },
    }));
    const __VLS_8 = __VLS_7({
        id: "user-code",
        modelValue: (__VLS_ctx.userCode),
        placeholder: "XXXX-XXXX",
        required: true,
        fluid: true,
        ...{ class: "code-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {__VLS_StyleScopedClasses['code-input']} */ ;
    let __VLS_11;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        type: "submit",
        label: "Vérifier",
        loading: (__VLS_ctx.loading),
        fluid: true,
    }));
    const __VLS_13 = __VLS_12({
        type: "submit",
        label: "Vérifier",
        loading: (__VLS_ctx.loading),
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
}
if (__VLS_ctx.step === 'approve') {
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
    (__VLS_ctx.clientName);
    if (__VLS_ctx.error) {
        let __VLS_16;
        /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
        Message;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            severity: "error",
            closable: (false),
            ...{ class: "msg" },
        }));
        const __VLS_18 = __VLS_17({
            severity: "error",
            closable: (false),
            ...{ class: "msg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        /** @type {__VLS_StyleScopedClasses['msg']} */ ;
        const { default: __VLS_21 } = __VLS_19.slots;
        (__VLS_ctx.error);
        // @ts-ignore
        [step, error, error, handleVerify, userCode, loading, clientName,];
        var __VLS_19;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "scopes" },
    });
    /** @type {__VLS_StyleScopedClasses['scopes']} */ ;
    for (const [scope] of __VLS_vFor((__VLS_ctx.scopes))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (scope),
            ...{ class: "scope-item" },
        });
        /** @type {__VLS_StyleScopedClasses['scope-item']} */ ;
        (__VLS_ctx.scopeDescriptions[scope] || scope);
        // @ts-ignore
        [scopes, scopeDescriptions,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
        ...{ onSubmit: (...[$event]) => {
                if (!(__VLS_ctx.step === 'approve'))
                    return;
                __VLS_ctx.handleApprove(true);
                // @ts-ignore
                [handleApprove,];
            } },
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
    let __VLS_22;
    /** @ts-ignore @type {typeof __VLS_components.InputText} */
    InputText;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        id: "email",
        modelValue: (__VLS_ctx.email),
        type: "email",
        placeholder: "vous@exemple.com",
        required: true,
        fluid: true,
    }));
    const __VLS_24 = __VLS_23({
        id: "email",
        modelValue: (__VLS_ctx.email),
        type: "email",
        placeholder: "vous@exemple.com",
        required: true,
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "password",
    });
    let __VLS_27;
    /** @ts-ignore @type {typeof __VLS_components.Password} */
    Password;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        id: "password",
        modelValue: (__VLS_ctx.password),
        feedback: (false),
        toggleMask: true,
        required: true,
        fluid: true,
    }));
    const __VLS_29 = __VLS_28({
        id: "password",
        modelValue: (__VLS_ctx.password),
        feedback: (false),
        toggleMask: true,
        required: true,
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "actions" },
    });
    /** @type {__VLS_StyleScopedClasses['actions']} */ ;
    let __VLS_32;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        ...{ 'onClick': {} },
        label: "Refuser",
        severity: "secondary",
        outlined: true,
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onClick': {} },
        label: "Refuser",
        severity: "secondary",
        outlined: true,
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_37;
    const __VLS_38 = ({ click: {} },
        { onClick: (...[$event]) => {
                if (!(__VLS_ctx.step === 'approve'))
                    return;
                __VLS_ctx.handleApprove(false);
                // @ts-ignore
                [loading, handleApprove, email, password,];
            } });
    var __VLS_35;
    var __VLS_36;
    let __VLS_39;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        type: "submit",
        label: "Autoriser",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_41 = __VLS_40({
        type: "submit",
        label: "Autoriser",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
}
if (__VLS_ctx.step === 'done') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "page-title" },
    });
    /** @type {__VLS_StyleScopedClasses['page-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "page-sub" },
    });
    /** @type {__VLS_StyleScopedClasses['page-sub']} */ ;
    let __VLS_44;
    /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
    Message;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        severity: (__VLS_ctx.resultSeverity),
        closable: (false),
        ...{ class: "msg" },
    }));
    const __VLS_46 = __VLS_45({
        severity: (__VLS_ctx.resultSeverity),
        closable: (false),
        ...{ class: "msg" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    /** @type {__VLS_StyleScopedClasses['msg']} */ ;
    const { default: __VLS_49 } = __VLS_47.slots;
    (__VLS_ctx.resultMessage);
    // @ts-ignore
    [step, loading, resultSeverity, resultMessage,];
    var __VLS_47;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
