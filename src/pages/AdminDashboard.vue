<template>
  <mdb-container class="mt-0 pt-0 mb-0" fluid style="height: 100vh">
    <mdb-row class="justify-content-center align-items-center h-100">
      <mdb-col col="4">
        <mdb-card>
          <mdb-card-header class="pt-4 text-center" color="amber darken-2">Books Checked Out</mdb-card-header>
          <mdb-card-body>
            <mdb-row class="justify-content-center">
              <mdb-tbl>
                <mdb-tbl-head>
                  <tr>
                    <th></th>
                    <th>Book ID</th>
                    <th>Book Title</th>
                    <th>Due Date</th>
                  </tr>
                </mdb-tbl-head>
                <mdb-tbl-body>
                  <tr v-for="(book, index) in booksCheckedOut" v-bind:key="index">
                    <th>{{index + 1}}</th>
                    <td>{{book.bookID}}</td>
                    <td>{{book.title}}</td>
                    <td>{{book.scheduledReturnDate}}</td>
                  </tr>
                </mdb-tbl-body>
              </mdb-tbl>
            </mdb-row>
            <mdb-row class="justify-content-center">
              <a tag="button" class="blue-text" @click="getDetailedList('checked out')">View detailed list</a>
            </mdb-row>
          </mdb-card-body>
        </mdb-card>
      </mdb-col>
      <mdb-col col="4">
        <mdb-card>
          <mdb-card-header class="pt-4 text-center" color="danger-color">Overdue Books</mdb-card-header>
          <mdb-card-body>
            <mdb-row class="justify-content-center">
              <mdb-tbl>
                <mdb-tbl-head>
                  <tr>
                    <th></th>
                    <th>Book ID</th>
                    <th>Book Title</th>
                    <th>Due Date</th>
                  </tr>
                </mdb-tbl-head>
                <mdb-tbl-body>
                  <tr v-for="(book, index) in booksOverdue" v-bind:key="index">
                    <th>{{index + 1}}</th>
                    <td>{{book.bookID}}</td>
                    <td>{{book.title}}</td>
                    <td>{{book.scheduledReturnDate}}</td>
                  </tr>
                </mdb-tbl-body>
              </mdb-tbl>
            </mdb-row>
            <mdb-row class="justify-content-center">
              <a tag="button" class="blue-text" @click="getDetailedList('overdue')">View detailed list</a>
            </mdb-row>
          </mdb-card-body>
        </mdb-card>
      </mdb-col>
    </mdb-row>
    <mdb-modal :show="showDetailedListModal" @close="showDetailedListModal = false" size="fluid">
      <mdb-modal-header :color="headerColor">
        <mdb-modal-title>{{modalTitle}}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <vue-good-table
          :isLoading="loading"
          :columns="detailedTableColumns"
          :rows="detailedTableRows"
          :search-options="{enabled: true}"
          :pagination-options="{
            enabled: true,
            mode: 'records',
          }"
          class="pt-4"
        >
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'returnBook'">
              <mdb-btn color="amber" size="sm" @click.native="returnBook(props.row)" title="Return Book"><mdb-icon icon="minus-square"></mdb-icon></mdb-btn>
            </span>
            <span v-else>
              {{props.formattedRow[props.column.field]}}
            </span>
          </template>
        </vue-good-table>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="amber" @click.native="showDetailedListModal = false">Close</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </mdb-container>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "AdminDashboard",
  props: {
    headers: Object,
    userInfo: Object
  },
  data() {
    return {
      books: null,
      todaysDate: new moment().format('YYYY-MM-DD'),
      booksCheckedOut: [],
      booksOverdue: [],
      showDetailedListModal: false,
      detailedTableRows: [],
      modalTitle: '',
      loading: false,
      headerColor: null,
      detailedTableColumns: [
        {label: 'Book ID', field: 'bookID'},
        {label: 'ISBN', field: 'isbn'},
        {label: 'Title', field: 'title'},
        {label: 'Author', field: 'author'},
        {label: 'Publisher', field: 'publisher'},
        {label: 'Genre', field: 'genre'},
        {label: 'Date Added', field: 'dateAdded'},
        {label: 'Date Modified', field: 'dateModified'},
        {label: '', field: 'returnBook'},
      ],
    }
  },
  methods: {
    async getBooksCheckedOut() {
      this.booksCheckedOut = [];
      this.booksOverdue = [];
      await axios
          .get('http://localhost:8080/rentals', {headers: this.headers})
          .then(response => (this.books = response.data));
      for(let i = 0; i < this.books.length; i++) {
        let book;
        await axios
            .get('http://localhost:8080/books/' + this.books[i].bookid, {headers: this.headers})
            .then(response => (book = response.data));
        book.dateAdded = moment(book.dateAdded).format("MM/DD/YYYY");
        book.dateModified = moment(book.dateModified).format("MM/DD/YYYY");
        book.scheduledReturnDate = this.books[i].scheduledReturnDate;
        book.rentalID = this.books[i].rentalID;
        if(moment(book.scheduledReturnDate).isAfter(moment(this.todaysDate))){
          this.booksCheckedOut.push(book);
        }
        else {
          this.booksOverdue.push(book)
        }
      }
    },
    async getDetailedList(list) {
      this.loading = true;
      this.detailedTableRows = [];
      if(list == 'checked out') {
        this.detailedTableRows = this.booksCheckedOut;
        this.modalTitle = 'Books Checked Out';
        this.headerColor = 'amber darken-2'
      }
      else {
        this.detailedTableRows = this.booksOverdue;
        this.modalTitle = 'Books Overdue';
        this.headerColor = 'danger-color';
      }
      this.showDetailedListModal = true;
      this.loading = false;
    },
    async returnBook(book) {
      let bookReturned;
      await axios
          .delete('http://localhost:8080/rentals/' + book.rentalID, {headers: this.headers})
          .then(response => (bookReturned = response));
      if(bookReturned.status === 200) {
        this.$notify({
          group: 'message',
          title: 'Success!',
          text: 'Book has been returned',
          type: 'success'
        });
        await this.getBooksCheckedOut();
      }
      else {
        this.$notify({
          group: 'message',
          title: 'Oops!',
          text: 'Something went wrong',
          type: 'success'
        });
      }
    }
  },
  mounted() {
    this.getBooksCheckedOut();
  }
}
</script>

<style scoped>

</style>