<template>
  <BaseCard id="teams" to="teams">
    <SectionTitle eyebrow="Sports & E-Sports" title="ทีมกีฬาที่ชอบ" />
    <ul class="teams">
      <li v-for="t in teams" :key="t.team">
        <span class="badge">
          <img v-if="t.logo" :src="t.logo" :alt="`โลโก้ ${t.team}`" loading="lazy">
          <span v-else class="emoji">{{ t.emoji }}</span>
        </span>
        <div>
          <p class="team">{{ t.team }}</p>
          <p class="sport">{{ t.sport }}</p>
        </div>
      </li>
    </ul>
  </BaseCard>
</template>

<script>
import BaseCard from '../base/BaseCard.vue'
import SectionTitle from '../base/SectionTitle.vue'

export default {
  name: 'FavoriteTeamCard',
  components: { BaseCard, SectionTitle },
  props: {
    teams: { type: Array, default: () => [] },
  },
}
</script>

<style scoped>
.teams {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
li {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 14px;
  background: var(--chip);
}
.badge {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  padding: 6px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--border);
  display: grid;
  place-items: center;
}
.badge img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.emoji {
  font-size: 26px;
}
p {
  margin: 0;
}
.team {
  font-weight: 700;
  color: var(--text);
}
.sport {
  font-size: 13px;
  color: var(--muted);
}
</style>
