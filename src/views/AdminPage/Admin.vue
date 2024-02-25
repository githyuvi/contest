<template>
	<div>
		<NavBar :navigation="navigation" @on-active-component-change="changeComponent"></NavBar>
		<component :is="navigation[index].component"></component>
		
	</div>
	<div>
		<div class="vld-parent">
			<loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></loading>
		</div>
	</div>
</template>

<script setup>
import NavBar from '../../components/CommonComponents/NavBar.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Loading from 'vue-loading-overlay';
import AdminHome from './AdminHome.vue';
import Create from './Create.vue';
import Exams from './Exams.vue';
import Timings from './Timings.vue';
import Submissions from './Submissions.vue';
import Access from './Access.vue';
import Score from './Score.vue';

const router = useRouter()

const navigation = ref([
	// { name: 'Home', path: '/', current: true, component: AdminHome},
	{ name: 'Create', path: '/create', current: true, component:Create },
	{ name: 'Timings', path: '/timings', current: false, component: Timings },
	{ name: 'Exams', path: '/active', current: false, component: Exams },
	{ name: 'Submissions', path: '/submissions', current: false, component:Submissions },
	{ name: 'Access', path: '/access', current: false, component:Access },
	{ name: 'Score', path: '/score', current: false, component:Score },
	
])

const index = ref(0)

const isLoading = ref(false)

function changeComponent(i) {
	index.value = i
}

</script>

<style scoped>
@import 'node_modules/vue-loading-overlay/dist/css/index.css';

</style>