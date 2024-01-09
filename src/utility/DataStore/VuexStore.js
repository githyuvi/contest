import { useStore } from "vuex";
import { computed } from "vue";

console.log("inside vuexstore module");
const store = useStore()


function getValue(variableName){
    return computed(() => store.state[variableName])
}

function setValue(variableName, value){
    store.commit(variableName, value)
}

export { getValue, setValue }