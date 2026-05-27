<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'

const route = useRoute()

const status = computed(() => (route.query.link_status as string) || '')
const provider = computed(() => (route.query.provider as string) || 'le fournisseur')

type Variant = { severity: 'success' | 'danger'; message: string }

const variant = computed<Variant>(() => {
  switch (status.value) {
    case 'linked':
      return {
        severity: 'success',
        message: `Votre compte ${provider.value} a ete lie avec succes.`,
      }
    case 'identity_already_linked':
      return {
        severity: 'danger',
        message: `Ce compte ${provider.value} est deja lie a un autre utilisateur.`,
      }
    case 'link_failed':
      return {
        severity: 'danger',
        message: `La liaison du compte ${provider.value} a echoue. Veuillez reessayer.`,
      }
    default:
      return {
        severity: 'danger',
        message: 'Statut de liaison inconnu.',
      }
  }
})
</script>

<template>
  <V2Card path="auth.orion.io / <b>linked-accounts</b>">
    <div class="v2-card__head">
      <h1 class="v2-card__title">Liaison de compte externe</h1>
      <p class="v2-card__sub">Resultat de la tentative de liaison.</p>
    </div>

    <div class="v2-card__body">
      <AuthAlert :severity="variant.severity">{{ variant.message }}</AuthAlert>
      <p class="text-[13px] leading-[1.55] text-fg-2 text-center" style="margin-top: 12px">
        Vous pouvez fermer cet onglet en toute securite.
      </p>
    </div>
  </V2Card>
</template>
