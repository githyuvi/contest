<script>
import SingleCorrectVue from "./SingleCorrect.vue";
import { useStore } from "vuex";
import { computed, reactive, ref } from "vue";
import {
  getDatabase,
  ref as firebaseRef,
  set,
  get,
  child,
} from "firebase/database";
import store from "../store";

export default {
  components: { SingleCorrectVue },
  props: {
    // ['question','answers','questionLocation', 'button = ""']
    question: {
      type: String,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
    questionLocation: {
      type: String,
      required: true,
    },
    buttons: {
      type: Array,
      default: [],
    },
    
  },
  data() {
    return {
      store: null,
      dbRef: null,
      options: "",
      userName: computed(() => store.state.userName),
      userEmail: computed(() => store.state.userEmail),
      isLoggedIn: computed(() => store.state.isLoggedIn),
      selectedToggle: "",
    };
  },

  mounted() {
    this.store = useStore();
    this.dbRef = firebaseRef(getDatabase());
    this.selectedToggle = this.getToggles();
    this.options = this.initializeOptions(this.answers);
    const userId = computed(() => this.store.state.userId);
    get(child(this.dbRef, `poll/` + userId.value + "/" + this.questionLocation))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userAnswers = snapshot.val();
          const selectedIndex = parseInt(userAnswers) - 1;
          this.selectedToggle[selectedIndex] = "selected";
        }
      })
      .catch((error) => {
        console.log(error);
        alert("couldn't fetch results");
      });
  },
  methods: {
    getToggles() {
      const length = this.answers.length;
      const toggles = reactive([]);
      for (var i = 0; i < length; i++) {
        toggles.push("");
      }
      return toggles;
    },
    initializeOptions(answers) {
      const options = [];
      for (let i = 0; i < answers.length; i++) {
        const element = answers[i];
        options.push({
          index: i,
          id: (i + 1).toString(),
          label: element,
        });
      }
      return options;
    },
    handlebutton(button) {
      console.log(button);
      if (button == "") {
        return;
      }

      if (button.toLowerCase().trim() == "submit") {
        this.submit();
      } else if (button.toLowerCase().trim() == "save and next") {
        // this.saveAndNext()
        return;
      } else if (button.toLowerCase().trim() == "previous") {
        // this.previous();
        return
      }
    },
    handleOptionSelected(value) {
        console.log('value', value)
    }
  },
};
</script>

<template>
  <div class="container">
    <SingleCorrectVue
      style="margin: auto"
      :options="options"
      :question="question"
      :selected-toggle="selectedToggle"
      @get-option-selected="handleOptionSelected"

    ></SingleCorrectVue>
    <div style="margin: 5px"></div>
    <div>
        <span v-for="button in buttons" style="margin: 15px">
            <input
                type="button"
                :value="button"
                style="margin-top: 8px; padding: 8px"
                @click="handlebutton(button)"
            />
        </span>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  /* justify-content: center;  */
  align-items: center;
  /* height: 100vh; */
}
</style>
