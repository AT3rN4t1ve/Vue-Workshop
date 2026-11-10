<template>
  <BaseCard>
    <SectionTitle eyebrow="Sports" title="ทีมกีฬาที่ชอบ" />
    <ul class="teams">
      <li v-for="t in teams" :key="t.team">
        <span class="emoji">{{ t.emoji }}</span>
        <div>
          <p class="team">{{ t.team }}</p>
          <p class="sport">{{ t.sport }}</p>
        </div>
      </li>
    </ul>
  </BaseCard>
</template>

<script>
// ใช้ครั้งเดียว: ทีมกีฬาที่ชอบ
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
