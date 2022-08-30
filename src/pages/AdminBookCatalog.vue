<template>
  <mdb-container class="amber-text" fluid style="height: 100vh">
    <mdb-btn style="margin-top: 80px !important" color="amber" @click.native="showAddBookModal = true">Add Book</mdb-btn>
    <vue-good-table
        :isLoading="loading"
        :columns="columns"
        :rows="rows"
        :search-options="{enabled: true}"
        class="pt-4"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'checkOut'">
          <mdb-btn outline="amber" size="sm" class="px-2" @click.native="showCheckOutModal(props.row)" title="Check Out Book"><mdb-icon icon="book-open"></mdb-icon></mdb-btn>
    </span>
        <span v-if="props.column.field == 'delete'">
          <mdb-btn outline="danger" size="sm" class="px-2" @click.native="deleteModal(props.row)" title="Delete Book"><mdb-icon icon="trash"></mdb-icon></mdb-btn>
    </span>
        <span v-else>
      {{props.formattedRow[props.column.field]}}
    </span>
      </template>
    </vue-good-table>
    <mdb-modal v-if="selectedBook" :show="showModal" @close="showModal = false" class="black-text" centered>
      <mdb-modal-header>
        <mdb-modal-title class="w-100">
          <span>Check Out <i>{{selectedBook.title}}</i> to User</span>
        </mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <div class="form-group">
          <label for="userID">User ID</label>
          <input type="text" id="userID" class="form-control" v-model="userID">
        </div>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn outline="amber" @click.native="showModal = false">Close</mdb-btn>
        <mdb-btn color="amber" @click.native="checkOutBook">Check Out</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal :show="showAddBookModal" @close="showAddBookModal = false" class="black-text" centered>
      <mdb-modal-header color="amber darken-2">
        <mdb-modal-title class="w-100">
          <span>Add a Book</span>
        </mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-row>
          <mdb-col col="6">
            <div class="form-group">
              <label for="bookID">Book ID</label>
              <input type="text" id="bookID" class="form-control" v-model="bookID">
            </div>
          </mdb-col>
          <mdb-col col="6">
            <div class="form-group">
              <label for="bookISBN">Book ISBN</label>
              <input type="text" id="bookISBN" class="form-control" v-model="bookISBN">
            </div>
          </mdb-col>
        </mdb-row>
        <mdb-row>
          <mdb-col col="6">
            <div class="form-group">
              <label for="bookTitle">Title</label>
              <input type="text" id="bookTitle" class="form-control" v-model="bookTitle">
            </div>
          </mdb-col>
          <mdb-col col="6">
            <div class="form-group">
              <label for="bookAuthor">Author</label>
              <input type="text" id="bookAuthor" class="form-control" v-model="bookAuthor">
            </div>
          </mdb-col>
        </mdb-row>
        <mdb-row>
          <mdb-col col="6">
            <div class="form-group">
              <label for="bookPublisher">Publisher</label>
              <input type="text" id="bookPublisher" class="form-control" v-model="bookPublisher">
            </div>
          </mdb-col>
          <mdb-col col="6">
            <div class="form-group">
              <label for="bookGenre">Genre</label>
              <input type="text" id="bookGenre" class="form-control" v-model="bookGenre">
            </div>
          </mdb-col>
        </mdb-row>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn outline="amber" @click.native="showAddBookModal = false">Close</mdb-btn>
        <mdb-btn
            v-if="bookID && bookISBN && bookTitle && bookAuthor && bookPublisher && bookGenre" color="amber" @click.native="addBook">Add Book
        </mdb-btn>
        <mdb-btn
            v-else color="amber" disabled>Check Out
        </mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal v-if="bookToDelete" :show="showDeleteModal" @close="showDeleteModal = false" class="black-text" centered>
      <mdb-modal-header>
        <mdb-modal-title class="w-100">
          Delete Book
        </mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <p>Are you sure you want to delete <i>{{bookToDelete.title}}</i></p>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn outline="amber" @click.native="showModal = false">Cancel</mdb-btn>
        <mdb-btn color="danger" @click.native="deleteBook">Delete</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </mdb-container>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "AdminBookCatalog",
  props: {
    userInfo: Object,
    headers: Object
  },
  data() {
    return {
      loading: true,
      selectedBook: null,
      showModal: false,
      userID: null,
      bookID: null,
      bookISBN: null,
      bookTitle: null,
      bookAuthor: null,
      bookPublisher: null,
      bookGenre: null,
      showAddBookModal: false,
      rentals: null,
      rentalIDs: null,
      bookToDelete: null,
      showDeleteModal: false,
      columns: [
        {label: 'Book ID', field: 'bookID'},
        {label: 'ISBN', field: 'isbn'},
        {label: 'Title', field: 'title'},
        {label: 'Author', field: 'author'},
        {label: 'Publisher', field: 'publisher'},
        {label: 'Genre', field: 'genre'},
        {label: 'Date Added', field: 'dateAdded'},
        {label: 'Date Modified', field: 'dateModified'},
        {label: '', field: 'checkOut', sortable: false},
        {label: '', field: 'delete', sortable: false},
      ],
      rows: null
    }
  },
  methods: {
    showCheckOutModal(book) {
      this.selectedBook = book;
      this.showModal = true;
    },
    deleteModal(book) {
      this.bookToDelete = book;
      this.showDeleteModal = true;
    },
    async deleteBook() {
      let deleteResponse;
      await axios
          .delete('http://localhost:8080/books/' + this.bookToDelete.bookID, {headers: this.headers})
          .then(response => (deleteResponse = response.data))
      if(deleteResponse.status === 200) {
        this.$notify({
          group: 'message',
          title: 'Success!',
          text: 'Book has been deleted',
          type: 'success'
        });
        this.getRentals();
        this.getBooks();
      }
      else {
        this.$notify({
          group: 'message',
          title: 'Oops!',
          text: 'Something went wrong',
          type: 'error'
        });
      }
      this.showDeleteModal = false;
    },
    async checkOutBook() {
      let checkedOut;
      let params = {
        rentalID: this.selectedBook.bookID,
        bookid: this.selectedBook.bookID,
        userid: this.userID,
        checkoutDate: new moment(),
        scheduledReturnDate: new moment().add(5, 'days')
      }
      await axios
          .post('http://localhost:8080/rentals', params, {headers: this.headers})
          .then(response => (checkedOut = response.data))
      if(checkedOut.rentalID) {
        this.$notify({
          group: 'message',
          title: 'Success!',
          text: 'Book has been checked out!',
          type: 'success'
        });
        this.showModal = false;
        this.getBooks();
      }
      else {
        this.$notify({
          group: 'message',
          title: 'Error',
          text: 'Something went wrong',
          type: 'error'
        });
      }
    },
    async addBook() {
      let bookAdded;
      let params = {
        bookID: this.bookID,
        isbn: this.bookISBN,
        title: this.bookTitle,
        author: this.bookAuthor,
        publisher: this.bookPublisher,
        genre: this.bookGenre,
        dateAdded: new moment(),
        dateModified: new moment(),
        userId: this.userInfo.userID
      }
      await axios
          .post('http://localhost:8080/books', params, {headers: this.headers})
          .then(response => (bookAdded = response.data))
      if(bookAdded.bookID) {
        this.$notify({
          group: 'message',
          title: 'Success!',
          text: 'Book has been added!',
          type: 'success'
        });
        this.showAddBookModal = false;
        this.getBooks();
      }
      else {
        this.$notify({
          group: 'message',
          title: 'Error',
          text: 'Something went wrong',
          type: 'error'
        });
      }
    },
    async getBooks() {
      await axios
          .get('http://localhost:8080/books', {headers: this.headers})
          .then(response => (this.rows = response.data))
      /*this.rows = [
        {
          "bookID": 101,
          "isbn": "978-0-06-223063-8",
          "title": "The Confidence Code",
          "author": "Katty Kay",
          "publisher": "HarperCollinsPublishers",
          "genre": "Womenomics",
          "dateAdded": "2001-10-10T05:00:00.000+00:00",
          "dateModified": "2005-10-10T05:00:00.000+00:00"
        },
        {
          "bookID": 102,
          "isbn": "978-0-06-223063-0",
          "title": "Every Exquisite Thing",
          "author": "Matthew Quick",
          "publisher": "Little, Brown and Company",
          "genre": "Fiction",
          "dateAdded": "2002-08-01T05:00:00.000+00:00",
          "dateModified": "2005-10-08T05:00:00.000+00:00"
        }
      ]*/
      for(let i=0; i < this.rows.length; i++) {
        if(this.rows[i].dateAdded) {
          this.rows[i].dateAdded = moment(this.rows[i].dateAdded).format("MM/DD/YYYY");
        }
        if(this.rows[i].dateModified) {
          this.rows[i].dateModified = moment(this.rows[i].dateModified).format("MM/DD/YYYY");
        }
        if(this.rentalIDs.includes(this.rows[i].rentalID)) {
          this.rows[i].rentalDisabled = true;
        }
        else {
          this.rows[i].rentalDisabled = false;
        }
      }
      this.loading = false;
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