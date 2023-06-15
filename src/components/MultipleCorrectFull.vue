<script>
import MultipleCorrectVue from "./MultipleCorrect.vue";
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
  components: { MultipleCorrectVue },
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
      db: null,
      dbRef: null,
      options: "",
      userId: null,
      userName: computed(() => store.state.userName),
      userEmail: computed(() => store.state.userEmail),
      isLoggedIn: computed(() => store.state.isLoggedIn),
      selectedToggle: "",
      optionsSelected: [],
    };
  },

  mounted() {
    this.store = useStore();
    this.db = getDatabase();
    this.dbRef = firebaseRef(this.db);
    this.selectedToggle = this.getToggles();
    this.options = this.initializeOptions(this.answers);
    this.userId = computed(() => this.store.state.userId);
    get(child(this.dbRef, `poll/` + this.userId + "/" + this.questionLocation))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userAnswers = snapshot.val();
          for (var i = 0; i < userAnswers.length; i++) {
            const selectedIndex = parseInt(userAnswers[i]) - 1;
            this.selectedToggle[selectedIndex] = "selected";
            this.optionsSelected.push(userAnswers[i])
          }
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
        console.log('optionsSelected', this.optionsSelected)
        set(
          firebaseRef(this.db, "answers/" + this.userId + "/" + this.questionLocation),
          this.optionsSelected
        )
        .then((value) => {
            // router.push('./pollresults')
            console.log('value', value)
          })
        .catch((e) => {
            console.log(e.message);
            alert("Submit error. Couldn't submit the answer");
        });
        return;
      } else if (button.toLowerCase().trim() == "previous") {
        // this.previous();
        return;
      }
    },
    handleOptionSelected(value) {
        console.log('value', value)
        this.optionsSelected = value
    }
  },
};
</script>

<template>
  <div class="container">
    <MultipleCorrectVue
      style="margin: auto"
      :options="options"
      :question="question"
      :selected-toggle="selectedToggle"
      @get-options-selected="handleOptionSelected"
      :options-selected="optionsSelected"
    ></MultipleCorrectVue>
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
