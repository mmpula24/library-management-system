<template>
  <mdb-container class="amber-text" fluid style="height: 100vh">
    <vue-good-table
      :isLoading="loading"
      :columns="columns"
      :rows="rows"
      :search-options="{enabled: true}"
      :pagination-options="{
        enabled: true,
        mode: 'records',
      }"
      class="pt-4"
      style="margin-top: 80px !important"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'addToCart'">
          <mdb-btn
            :disabled="props.row.checkedOut"
            color="amber"
            size="sm"
            @click.native="addToCart(props.row)"
            title="Add to Cart">
            <mdb-icon icon="plus"></mdb-icon>
          </mdb-btn>
        </span>
        <span v-else>
          {{props.formattedRow[props.column.field]}}
        </span>
      </template>
    </vue-good-table>
  </mdb-container>
</template>

<script>
import axios from "axios";
import moment from 'moment';

export default {
  name: "BookCatalog",
  props: {
    headers: Object,
    userInfo: Object,
    cart: Array
  },
  data() {
    return {
      loading: true,
      bookView: null,
      showBookModal: false,
      rentals: null,
      rentalIDs: null,
      columns: [
        {label: 'Book ID', field: 'bookID'},
        {label: 'ISBN', field: 'isbn'},
        {label: 'Title', field: 'title'},
        {label: 'Author', field: 'author'},
        {label: 'Publisher', field: 'publisher'},
        {label: 'Genre', field: 'genre'},
        {label: 'Date Added', field: 'dateAdded'},
        {label: 'Date Modified', field: 'dateModified'},
        {label: '', field: 'addToCart', sortable: false},
      ],
      rows: null,
    }
  },
  methods: {
    async getBooks() {
      await axios
          .get('http://localhost:8080/books', {headers: this.headers})
          .then(response => (this.rows = response.data))
      for(let i=0; i < this.rows.length; i++) {
        if(this.rows[i].dateAdded) {
          this.rows[i].dateAdded = moment(this.rows[i].dateAdded).format("MM/DD/YYYY");
        }
        if(this.rows[i].dateModified) {
          this.rows[i].dateModified = moment(this.rows[i].dateModified).format("MM/DD/YYYY");
        }
        if(this.rentalIDs.includes(this.rows[i].bookID)) {
          this.rows[i].checkedOut = true;
        }
        else {
          this.rows[i].checkedOut = false;
        }
      }
      this.loading = false
    },
    addToCart(book) {
      this.$emit('update-cart', book)
    },
    async getRentals() {
      this.rentalIDs = [];
      await axios
          .get('http://localhost:8080/rentals', {headers: this.headers})
          .then(response => (this.rentals = response.data))
      for (let i = 0; i < this.rentals.length; i++) {
        this.rentalIDs.push(this.rentals[i].rentalID);
      }
    }
  },
  mounted() {
    this.getRentals();
    this.getBooks();
  }
}
</script>

<style scoped>

</style>