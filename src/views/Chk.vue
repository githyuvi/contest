<script setup>
    import { Client, Functions } from "appwrite";

    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('646fd2bef41bc686ae90');

    const functions = new Functions(client);

    const getAppwriteResponse = () => {
        let promise = functions.createExecution('6476f0ac9d3fd7ded0a5');

        promise.then(function (response) {
            console.log(response); // Success
        }, function (error) {
            console.log(error); // Failure
        });
    }

    
</script>

<template>

    <button @click="getAppwriteResponse"> Check appwrite functions</button>
</template>