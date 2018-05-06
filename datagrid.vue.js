var eventBus = new Vue();

Vue.component('asa-datagrid', {
    props: {
        data: Array,
        columns: Array,
        actionHref: String,
        filterKey: String,
        dgClass: String
    },

    data: function() {
        var sortOrders = {}
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },

    template: `
    <table :class="dgClass">
        <thead>
            <tr>
                <th v-for="key in columns"
                    @click="sortBy(key)"
                    :class="{ active: sortKey == key }"
                >
                    {{ key | capitalize }}
                    <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"></span>                    
                </th>
                <th class="has-text-centered" style="width: 10%;">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="entry in filteredData">
                <td v-for="key in columns">
                    {{ entry[key] }}
                </td>
                <td class="has-text-centered" style="width: 10%;">
                    <a :href="actionHref + '/' + entry.id" @click.prevent="onEdit(entry.id)"><i class="fas fa-edit"></i></a> 
                    <a :href="actionHref + '/' + entry.id + '/delete'" @click.prevent="onDelete(entry.id)"><i class="fas fa-trash"></i></a>
                </td>
            </tr>
        </tbody>
    </table>
    `,

    computed: {
        filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data
        }
    },

    filters: {
        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },

    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        },

        onEdit: function(id) {
            console.log("Edit " + id);
            eventBus.$emit("on-edit", id);
        },

        onDelete: function(id) {
            console.log("Delete " + id);
            eventBus.$emit("on-delete", id);
        },
    },

});