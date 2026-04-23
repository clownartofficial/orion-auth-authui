/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiPost } from '../composables/useApi';
import { useSettings } from '../composables/useSettings';
const route = useRoute();
const router = useRouter();
const { registrationEnabled, fetchSettings } = useSettings();
const inviteToken = computed(() => route.query.invite);
const inviteEmail = computed(() => route.query.email);
const isInvite = computed(() => !!inviteToken.value);
const displayName = ref('');
const email = ref(inviteEmail.value ?? '');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref(null);
const success = ref(false);
onMounted(async () => {
    if (!isInvite.value) {
        await fetchSettings();
        if (registrationEnabled.value === false) {
            router.replace('/login');
        }
    }
});
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
    if (isInvite.value) {
        const result = await apiPost('/api/v1/auth/register/invite', {
            token: inviteToken.value,
            password: password.value,
            display_name: displayName.value || undefined,
        });
        loading.value = false;
        if (!result.ok) {
            if (result.status === 400) {
                error.value = 'Invitation invalide ou expirée.';
            }
            else if (result.status === 409) {
                error.value = 'Cette invitation a déjà été utilisée.';
            }
            else {
                error.value = result.message;
            }
            return;
        }
    }
    else {
        const result = await apiPost('/api/v1/auth/register', {
            email: email.value,
            password: password.value,
            display_name: displayName.value || undefined,
        });
        loading.value = false;
        if (!result.ok) {
            if (result.status === 403) {
                error.value = "L'inscription publique est désactivée. Contactez un administrateur pour recevoir une invitation.";
            }
            else if (result.status === 409) {
                error.value = 'Un compte existe déjà avec cet email.';
            }
            else {
                error.value = result.message;
            }
            return;
        }
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
/** @type {__VLS_StyleScopedClasses['links']} */ ;
/** @type {__VLS_StyleScopedClasses['links']} */ ;
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
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
(__VLS_ctx.isInvite ? ' --invite' : '');
if (__VLS_ctx.success) {
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
    Message;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        severity: "success",
        closable: (false),
    }));
    const __VLS_2 = __VLS_1({
        severity: "success",
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    if (__VLS_ctx.isInvite) {
    }
    else {
    }
    // @ts-ignore
    [isInvite, isInvite, success,];
    var __VLS_3;
    let __VLS_6;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        to: "/login",
        ...{ class: "back-link" },
    }));
    const __VLS_8 = __VLS_7({
        to: "/login",
        ...{ class: "back-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {__VLS_StyleScopedClasses['back-link']} */ ;
    const { default: __VLS_11 } = __VLS_9.slots;
    (__VLS_ctx.isInvite ? 'Se connecter' : 'Retour à la connexion');
    // @ts-ignore
    [isInvite,];
    var __VLS_9;
}
else {
    if (__VLS_ctx.error) {
        let __VLS_12;
        /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
        Message;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
            severity: "error",
            closable: (false),
            ...{ class: "msg" },
        }));
        const __VLS_14 = __VLS_13({
            severity: "error",
            closable: (false),
            ...{ class: "msg" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        /** @type {__VLS_StyleScopedClasses['msg']} */ ;
        const { default: __VLS_17 } = __VLS_15.slots;
        (__VLS_ctx.error);
        // @ts-ignore
        [error, error,];
        var __VLS_15;
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
        for: "displayName",
    });
    let __VLS_18;
    /** @ts-ignore @type {typeof __VLS_components.InputText} */
    InputText;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        id: "displayName",
        modelValue: (__VLS_ctx.displayName),
        placeholder: "Optionnel",
        fluid: true,
    }));
    const __VLS_20 = __VLS_19({
        id: "displayName",
        modelValue: (__VLS_ctx.displayName),
        placeholder: "Optionnel",
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "email",
    });
    let __VLS_23;
    /** @ts-ignore @type {typeof __VLS_components.InputText} */
    InputText;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        id: "email",
        modelValue: (__VLS_ctx.email),
        type: "email",
        placeholder: "vous@exemple.com",
        disabled: (__VLS_ctx.isInvite),
        required: true,
        fluid: true,
    }));
    const __VLS_25 = __VLS_24({
        id: "email",
        modelValue: (__VLS_ctx.email),
        type: "email",
        placeholder: "vous@exemple.com",
        disabled: (__VLS_ctx.isInvite),
        required: true,
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "password",
    });
    let __VLS_28;
    /** @ts-ignore @type {typeof __VLS_components.Password} */
    Password;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        id: "password",
        modelValue: (__VLS_ctx.password),
        feedback: (false),
        toggleMask: true,
        required: true,
        fluid: true,
    }));
    const __VLS_30 = __VLS_29({
        id: "password",
        modelValue: (__VLS_ctx.password),
        feedback: (false),
        toggleMask: true,
        required: true,
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "confirmPassword",
    });
    let __VLS_33;
    /** @ts-ignore @type {typeof __VLS_components.Password} */
    Password;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        id: "confirmPassword",
        modelValue: (__VLS_ctx.confirmPassword),
        feedback: (false),
        toggleMask: true,
        required: true,
        fluid: true,
    }));
    const __VLS_35 = __VLS_34({
        id: "confirmPassword",
        modelValue: (__VLS_ctx.confirmPassword),
        feedback: (false),
        toggleMask: true,
        required: true,
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    let __VLS_38;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        type: "submit",
        label: "Créer le compte",
        loading: (__VLS_ctx.loading),
        fluid: true,
    }));
    const __VLS_40 = __VLS_39({
        type: "submit",
        label: "Créer le compte",
        loading: (__VLS_ctx.loading),
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "links" },
    });
    /** @type {__VLS_StyleScopedClasses['links']} */ ;
    let __VLS_43;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        to: "/login",
    }));
    const __VLS_45 = __VLS_44({
        to: "/login",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const { default: __VLS_48 } = __VLS_46.slots;
    // @ts-ignore
    [isInvite, handleSubmit, displayName, email, password, confirmPassword, loading,];
    var __VLS_46;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
