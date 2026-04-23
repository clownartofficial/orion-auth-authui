/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import { apiPost } from '../composables/useApi';
const email = ref('');
const loading = ref(false);
const submitted = ref(false);
async function handleSubmit() {
    loading.value = true;
    await apiPost('/api/v1/auth/forgot-password', {
        email: email.value,
    });
    loading.value = false;
    submitted.value = true;
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
if (__VLS_ctx.submitted) {
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
    Message;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        severity: "info",
        closable: (false),
    }));
    const __VLS_2 = __VLS_1({
        severity: "info",
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    // @ts-ignore
    [submitted,];
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
    // @ts-ignore
    [];
    var __VLS_9;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "page-desc" },
    });
    /** @type {__VLS_StyleScopedClasses['page-desc']} */ ;
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
    let __VLS_12;
    /** @ts-ignore @type {typeof __VLS_components.InputText} */
    InputText;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        id: "email",
        modelValue: (__VLS_ctx.email),
        type: "email",
        placeholder: "vous@exemple.com",
        required: true,
        fluid: true,
    }));
    const __VLS_14 = __VLS_13({
        id: "email",
        modelValue: (__VLS_ctx.email),
        type: "email",
        placeholder: "vous@exemple.com",
        required: true,
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_17;
    /** @ts-ignore @type {typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        type: "submit",
        label: "Envoyer le lien",
        loading: (__VLS_ctx.loading),
        fluid: true,
    }));
    const __VLS_19 = __VLS_18({
        type: "submit",
        label: "Envoyer le lien",
        loading: (__VLS_ctx.loading),
        fluid: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "links" },
    });
    /** @type {__VLS_StyleScopedClasses['links']} */ ;
    let __VLS_22;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        to: "/login",
    }));
    const __VLS_24 = __VLS_23({
        to: "/login",
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    const { default: __VLS_27 } = __VLS_25.slots;
    // @ts-ignore
    [handleSubmit, email, loading,];
    var __VLS_25;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
