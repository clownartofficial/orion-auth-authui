/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { apiPost } from '../composables/useApi';
const route = useRoute();
const token = route.query.token;
const loading = ref(true);
const error = ref(null);
const success = ref(false);
onMounted(async () => {
    if (!token) {
        error.value = 'Lien de vérification invalide.';
        loading.value = false;
        return;
    }
    const result = await apiPost('/api/v1/auth/verify-email', { token });
    loading.value = false;
    if (!result.ok) {
        error.value = result.message;
        return;
    }
    success.value = true;
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content" },
});
/** @type {__VLS_StyleScopedClasses['content']} */ ;
if (__VLS_ctx.loading) {
    let __VLS_0;
    /** @ts-ignore @type {typeof __VLS_components.ProgressSpinner} */
    ProgressSpinner;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
if (__VLS_ctx.success) {
    let __VLS_5;
    /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
    Message;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        severity: "success",
        closable: (false),
    }));
    const __VLS_7 = __VLS_6({
        severity: "success",
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_10 } = __VLS_8.slots;
    // @ts-ignore
    [loading, success,];
    var __VLS_8;
    let __VLS_11;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        to: "/login",
        ...{ class: "back-link" },
    }));
    const __VLS_13 = __VLS_12({
        to: "/login",
        ...{ class: "back-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    /** @type {__VLS_StyleScopedClasses['back-link']} */ ;
    const { default: __VLS_16 } = __VLS_14.slots;
    // @ts-ignore
    [];
    var __VLS_14;
}
if (__VLS_ctx.error) {
    let __VLS_17;
    /** @ts-ignore @type {typeof __VLS_components.Message | typeof __VLS_components.Message} */
    Message;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        severity: "error",
        closable: (false),
    }));
    const __VLS_19 = __VLS_18({
        severity: "error",
        closable: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    const { default: __VLS_22 } = __VLS_20.slots;
    (__VLS_ctx.error);
    // @ts-ignore
    [error, error,];
    var __VLS_20;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
