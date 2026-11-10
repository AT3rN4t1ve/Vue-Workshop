<template>
  <v-container class="py-8 py-sm-12">
    <v-row justify="center">
      <v-col cols="12" sm="9" md="6" lg="5" xl="4">
        <div class="text-center mb-6">
          <v-avatar size="64" class="hero-icon mb-3">
            <v-icon size="34" color="white">mdi-school-outline</v-icon>
          </v-avatar>
          <h1 class="hero-title">โปรแกรมตัดเกรด</h1>
          <p class="hero-subtitle mb-0">กรอกคะแนนเพื่อดูเกรดที่ได้ทันที</p>
        </div>

        <v-card class="main-card pa-5 pa-sm-7">
          <v-text-field
            v-model="score"
            label="คะแนน (0 - 100)"
            placeholder="เช่น 75"
            prepend-inner-icon="mdi-pencil-outline"
            inputmode="decimal"
            outlined
            rounded
            clearable
            autofocus
            hide-details="auto"
            :error-messages="error"
            @input="error = ''"
            @keyup.enter="calculateGrade"
          />

          <v-btn
            class="submit-btn mt-4"
            block
            x-large
            rounded
            depressed
            dark
            @click="calculateGrade"
          >
            <v-icon left>mdi-calculator-variant-outline</v-icon>
            ตัดเกรด
          </v-btn>

          <v-expand-transition>
            <div v-if="grade" :key="resultKey">
              <GradeResult class="mt-6" :score="checkedScore" :item="current" />
            </div>
          </v-expand-transition>

          <GradeScale class="mt-7" :items="gradeTable" :active-grade="grade" />
        </v-card>

        <p class="footer-note text-center mt-6 mb-0">Workshop 2 · Vue + Vuetify</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GradeResult from './GradeResult'
import GradeScale from './GradeScale'

export default {
  name: 'GradeCalculator',

  components: {
    GradeResult,
    GradeScale,
  },

  data: () => ({
    score: '',
    checkedScore: null,
    grade: '',
    error: '',
    resultKey: 0,
    gradeTable: [
      { grade: 'A', range: '80 - 100', label: 'ดีเยี่ยม', color: '#16A34A', soft: '#ECFDF3' },
      { grade: 'B', range: '70 - 79', label: 'ดี', color: '#0D9488', soft: '#EBFBF8' },
      { grade: 'C', range: '60 - 69', label: 'พอใช้', color: '#D97706', soft: '#FFF7E6' },
      { grade: 'D', range: '50 - 59', label: 'ผ่าน', color: '#EA580C', soft: '#FFF1E8' },
      { grade: 'F', range: '0 - 49', label: 'ไม่ผ่าน', color: '#DC2626', soft: '#FEEEEE' },
    ],
  }),

  computed: {
    current() {
      return this.gradeTable.find((item) => item.grade === this.grade) || {}
    },
  },

  methods: {
    calculateGrade() {
      this.grade = ''
      this.error = ''

      // v-text-field คืนค่า null เมื่อกดปุ่ม clear
      const input = String(this.score == null ? '' : this.score).trim()

      if (input === '') {
        this.error = 'กรุณากรอกคะแนน'
        return
      }

      // ต้องเป็นตัวเลขล้วน (มีทศนิยมหรือเครื่องหมายลบได้) ห้ามมีตัวอักษรปน
      if (!/^-?\d+(\.\d+)?$/.test(input)) {
        this.error = 'กรุณากรอกเป็นตัวเลขเท่านั้น ห้ามกรอกตัวอักษร'
        return
      }

      const value = Number(input)

      if (value < 0 || value > 100) {
        this.error = 'คะแนนต้องอยู่ในช่วง 0 - 100 เท่านั้น'
        return
      }

      this.checkedScore = value
      this.resultKey += 1

      if (value >= 80) this.grade = 'A'
      else if (value >= 70) this.grade = 'B'
      else if (value >= 60) this.grade = 'C'
      else if (value >= 50) this.grade = 'D'
      else this.grade = 'F'
    },
  },
}
</script>

<style scoped>
.hero-icon {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.35);
}

.hero-title {
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1.3;
  color: #1e1b4b;
}

.hero-subtitle {
  color: #6b7280;
}

.main-card {
  border-radius: 24px !important;
  box-shadow: 0 20px 50px rgba(49, 46, 129, 0.12) !important;
}

.submit-btn {
  background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(79, 70, 229, 0.35);
}

.footer-note {
  font-size: 0.8rem;
  color: #9ca3af;
}
</style>
