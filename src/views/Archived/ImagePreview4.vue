<template>
<VDContainer
    :width=350         
    :animation=true    
    :data=files       
    type="sort"        
    @getData=funcName  
>
    <template v-slot:VDC="{data, index}">
        <div>
            <!-- edit your own components here -->
             {{data.name}} 
            
            
            
        </div>
    </template>
</VDContainer>
<button @click="getData">getData</button>
</template>


<script>

export default {
    data() {
        return {
            files: [
                
                {name: '1', url: 'abc'},
                {name: '2'  , url: 'cba'},
                

            ]
        }
    },
    methods: {
        getData() {
            console.log(this.datas)
        }
    }
}

</script>