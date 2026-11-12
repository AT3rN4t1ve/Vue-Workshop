<template>
  <v-container class="py-8 py-sm-12">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="11" lg="9" xl="7">
        <div class="hero d-flex align-center justify-center mb-6">
          <v-avatar size="56" class="hero-icon mr-4">
            <v-icon size="30" color="white">mdi-school-outline</v-icon>
          </v-avatar>
          <div>
            <h1 class="hero-title">โปรแกรมตัดเกรด</h1>
            <p class="hero-subtitle mb-0">กรอกคะแนนเพื่อดูเกรดที่ได้ทันที</p>
          </div>
        </div>

        <v-card class="main-card pa-5 pa-sm-7">
          <v-row>
            <v-col cols="12" md="7" class="pr-md-6">
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

              <v-slider
                :value="sliderValue"
                class="mt-5"
                color="#6d28d9"
                track-color="#e4e2f5"
                min="0"
                max="100"
                step="1"
                thumb-label
                hide-details
                @input="onSlide"
              >
                <template #prepend>
                  <span class="slider-edge">0</span>
                </template>
                <template #append>
                  <span class="slider-edge">100</span>
                </template>
              </v-slider>

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
                <div v-if="grade">
                  <GradeResult class="mt-6" :score="checkedScore" :item="current" />
                </div>
              </v-expand-transition>

              <div v-if="!grade" class="result-placeholder mt-6">
                <v-icon size="40" color="#c7c9e0">mdi-chart-donut</v-icon>
                <div class="mt-2">ผลการตัดเกรดจะแสดงที่นี่</div>
              </div>
            </v-col>

            <v-col cols="12" md="5" class="scale-col pl-md-6">
              <GradeScale
                :items="gradeTable"
                :active-grade="grade"
                :score="grade ? checkedScore : null"
              />
            </v-col>
          </v-row>
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
    gradeTable: [
      { grade: 'A', min: 80, range: '80 - 100', label: 'ดีเยี่ยม', color: '#16A34A', soft: '#ECFDF3' },
      { grade: 'B', min: 70, range: '70 - 79', label: 'ดี', color: '#0D9488', soft: '#EBFBF8' },
      { grade: 'C', min: 60, range: '60 - 69', label: 'พอใช้', color: '#D97706', soft: '#FFF7E6' },
      { grade: 'D', min: 50, range: '50 - 59', label: 'ผ่าน', color: '#EA580C', soft: '#FFF1E8' },
      { grade: 'F', min: 0, range: '0 - 49', label: 'ไม่ผ่าน', color: '#DC2626', soft: '#FEEEEE' },
    ],
  }),

  computed: {
    current() {
      return this.gradeTable.find((item) => item.grade === this.grade) || {}
    },

    sliderValue() {
      const value = Number(this.score)
      if (this.score === '' || this.score == null || Number.isNaN(value)) return 0
      return Math.min(100, Math.max(0, value))
    },
  },

  methods: {
    onSlide(value) {
      this.score = String(value)
      this.calculateGrade()
    },

    calculateGrade() {
      this.grade = ''
      this.error = ''

      const input = String(this.score == null ? '' : this.score).trim()

      if (input === '') {
        this.error = 'กรุณากรอกคะแนน'
        return
      }

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
      this.grade = this.gradeTable.find((item) => value >= item.min).grade
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

.result-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 182px;
  border: 1.5px dashed #dcdff0;
  border-radius: 20px;
  color: #9ca3af;
  font-size: 0.9rem;
}

.scale-col {
  border-top: 1px solid #eceef6;
}

@media (min-width: 960px) {
  .scale-col {
    border-top: none;
    border-left: 1px solid #eceef6;
  }
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

.slider-edge {
  font-size: 0.75rem;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
}

.footer-note {
  font-size: 0.8rem;
  color: #9ca3af;
}
</style>
