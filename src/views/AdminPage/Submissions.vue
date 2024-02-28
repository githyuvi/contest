<template>
	<div class="mb-4 p-4">
		<form @submit.prevent="fetchSubmissions">
			<label for="examname" class="block">Enter exam name</label>
			<input v-model="examName" id="examname" type="text" class="border p-2">
			<button class="bg-blue-500 text-white py-2 px-4 rounded mt-2">
				Enter
			</button>
		</form>
	</div>
	<div v-if="show" class="container ml-4 mt-2">
		<h1 class="text-3xl font-semibold mb-4 mr-4">Live Submissions </h1>


		<div v-for="contest in submissionsLive" :key="contest.contestName">
			<div class="flex">
				<h2 class="text-2xl font-semibold mb-4 mr-2">{{ contest.contestName }}</h2>
				<button @click="() => downloadAllSubmissions(contest)" class="bg-blue-500 text-white px-3 rounded">
					Download All
				</button>
			</div>

			<div v-for="submission in contest.submissions" :key="submission.email" class="mb-1">
				<div class="flex items-center bg-gray-200 p-1 rounded-lg w-fit">
					<div class="font-semibold mr-3">{{ submission.email }}</div>
					<div class="text-gray-600">
						<button @click="() => downloadSubmissions(contest.contestName, submission.email, submission.submission)"
							class="bg-blue-500 text-white px-4 py-2 rounded">
							Download
						</button>
					</div>
				</div>
			</div>
			<div class="border-t border-gray-500 my-8"></div>


		</div>
	</div>
	<div v-if="show" class="container ml-4 mt-2">
		<h1 class="text-3xl font-semibold mb-4 mr-4">Offline Submissions </h1>


		<div v-for="contest in submissionsOffline" :key="contest.contestName">
			<div class="flex">
				<h2 class="text-2xl font-semibold mb-4 mr-2">{{ contest.contestName }}</h2>
				<button @click="() => downloadAllSubmissions(contest)" class="bg-blue-500 text-white px-3 rounded">
					Download All
				</button>
			</div>

			<div v-for="submission in contest.submissions" :key="submission.email" class="mb-1">
				<div class="flex items-center bg-gray-200 p-1 rounded-lg w-fit">
					<div class="font-semibold mr-3">{{ submission.email }}</div>
					<div class="text-gray-600">
						<button @click="() => downloadSubmissions(contest.contestName, submission.email, submission.submission)"
							class="bg-blue-500 text-white px-4 py-2 rounded">
							Download
						</button>
					</div>
				</div>
			</div>
			<div class="border-t border-gray-500 my-8"></div>


		</div>
	</div>	

	<div id="snackbar">
		<div>Total {{ fileCount }} files will be downloaded</div>
	</div>
	<div class="flex items-center justify-center h-screen">
		<Loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></Loading>
	</div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import axios from 'axios';
import Loading from 'vue-loading-overlay'
import { getDownloadURL, ref as firebaseStorageRef, getStorage } from 'firebase/storage';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const storage = getStorage()
const liveSubmissions = ref({})
const offlineSubmissions = ref({})
const submissionsLive = ref([])
const submissionsOffline = ref([])
const isLoading = ref(false)
const userData = ref({})
const fileCount = ref(0)
const show = ref(false)
const examName = ref('')

const BASE_URL = process.env.VUE_APP_BASE_URL = 'https://vueexam-15ff4-default-rtdb.firebaseio.com'
const AUTH = process.env.VUE_APP_AUTH = 'auth=tvkUOXCOI0Ol1BhiFEsD5CZjnofCTcuLXIvqquVl'

async function fetchLiveSubmissions() {
	isLoading.value = true
	const liveSubmissionsData = await axios.get(`${BASE_URL}/livecontestsubmission/${examName.value}.json?${AUTH}`)
	liveSubmissions.value = {}
	liveSubmissions.value[examName.value] = liveSubmissionsData.data
	isLoading.value = false
}
async function fetchSubmissions() {
	await fetchLiveSubmissions()
	await fetchOfflineSubmissions()
	setLiveSubmissions()
	setOfflineSubmissions()
	show.value = true

}
async function fetchOfflineSubmissions() {
	isLoading.value = true
	const offlineSubmissionsData = await axios.get(`${BASE_URL}/offlinecontestsubmission/${examName.value}.json?${AUTH}`)
	offlineSubmissions.value = {}
	offlineSubmissions.value[examName.value] = offlineSubmissionsData.data
	isLoading.value = false
}

async function fetchUserData() {
	isLoading.value = true
	const userdata = await axios.get(`${BASE_URL}/users.json?${AUTH}`)
	userData.value = userdata.data
	isLoading.value = false
}

function setLiveSubmissions() {
	let userSubmissionPerContest = []
	for (let contestName in liveSubmissions.value) {
		let contestSubmissions = {}
		contestSubmissions['contestName'] = contestName
		contestSubmissions['submissions'] = []
		for (let userId in liveSubmissions.value[contestName]) {
			let userSubmission = {}
			userSubmission['email'] = userData.value[userId] ? userData.value[userId].email : 'user not found'
			userSubmission['submission'] = getSubjectiveSubmissions(liveSubmissions.value[contestName][userId].answers)
			contestSubmissions['submissions'].push(userSubmission)
		}
		userSubmissionPerContest.push(contestSubmissions)
	}
	submissionsLive.value = userSubmissionPerContest
}

function setOfflineSubmissions() {
	let userSubmissionPerContest = []
	for (let contestName in offlineSubmissions.value) {
		let contestSubmissions = {}
		contestSubmissions['contestName'] = contestName
		contestSubmissions['submissions'] = []
		for (let userId in offlineSubmissions.value[contestName]) {
			let userSubmission = {}
			userSubmission['email'] = userData.value[userId] ? userData.value[userId].email : 'user not found'
			userSubmission['submission'] = getSubjectiveSubmissions(offlineSubmissions.value[contestName][userId].answers)
			contestSubmissions['submissions'].push(userSubmission)
		}
		userSubmissionPerContest.push(contestSubmissions)
	}
	submissionsOffline.value = userSubmissionPerContest

}

async function downloadSubmissions(contestName, email, imageLinks) {
	console.log(imageLinks)
	isLoading.value = true

	let files = []
	files = await processImageLinks(imageLinks);
	isLoading.value = false
	if (files.length == 0) {
		alert('No subjective submissions')
		return
	}
	let zipFileName = contestName + '_' + email
	const zipBlob = await zipFiles(files, zipFileName)
	saveZipFile(files, zipFileName)

}
function getSubjectiveSubmissions(submissions) {
	let subjectiveSubmissions = []
	for (let questionNumber in submissions) {
		if (submissions[questionNumber].images != null) {
			subjectiveSubmissions.push({
				questionNumber: questionNumber,
				submission: submissions[questionNumber].images
			})
		}
	}
	return subjectiveSubmissions
}

const fetchAndCreateFiles = async (question) => {
	const promises = question.submission.map(async (firebaseUrl, index) => {
		let imageName;
		if (examName.value == 'mock' || examName.value == 'mock2')
			imageName = question.questionNumber + '-' + (index + 1) + '.jpg';
		else {
			const parts = firebaseUrl.split('/');
			imageName = parts[parts.length - 1];
		}
		const url = await getDownloadURL(firebaseStorageRef(storage, firebaseUrl));
		const response = await fetch(url);
		const blob = await response.blob();
		console.log(response);

		return new File([blob], `${imageName}`, { type: blob.type });
	});

	return Promise.all(promises);
};

const processImageLinks = async (imageLinks) => {
	let files = []
	for (let i = 0; i < imageLinks.length; i++) {
		const question = imageLinks[i];
		const questionFiles = await fetchAndCreateFiles(question);
		files = files.concat(questionFiles);
	}

	// Now 'files' contains all the File objects
	return files
};

const zipFiles = async (files, zipFileName) => {
	const zip = new JSZip();

	// Create a folder named "hello_world" in the zip file
	const folder = zip.folder(zipFileName);

	// Add each file to the folder
	files.forEach((file, index) => {
		folder.file(file.name, file);
	});

	// Generate the zip file
	const zipBlob = await zip.generateAsync({ type: 'blob' });
	return zipBlob
};

const saveZipFile = (zipBlob, zipFileName) => {
	// Save the zip file
	saveAs(zipBlob, zipFileName + '.zip');
}

const downloadAllSubmissions = async (contest) => {
	isLoading.value = true;
	let allFiles = [];
	let contestName = contest.contestName;

	// Create a zip file
	const zip = new JSZip();

	// Iterate through each submission in the contest
	for (let submission of contest.submissions) {
		let email = removeAfterAt(submission.email);
		let imageLinks = submission.submission;

		// Process image links and get files
		let files = await processImageLinks(imageLinks);
		allFiles.push({
			email: email,
			files: files
		});
	}

	// Add files to the zip file
	for (let userData of allFiles) {
		let email = userData.email;
		let files = userData.files;

		// Create a folder for each user inside the contest folder
		const userFolder = zip.folder(`${contestName}/${email}`);

		// Add each file to the user's folder
		files.forEach((file, index) => {
			userFolder.file(file.name, file);
		});
	}

	// Generate the zip file
	const zipBlob = await zip.generateAsync({ type: 'blob' });

	// Save the zip file
	saveAs(zipBlob, `${contestName}.zip`);

	isLoading.value = false;
};

function removeAfterAt(email) {
    const parts = email.split('@');
    return parts[0];
}

onBeforeMount(async () => {
	isLoading.value = true
	await fetchUserData()
	isLoading.value = false
})
</script>

<style scoped>
@import '../../assets/snackbar.css';
</style>