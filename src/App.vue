<template>
    <mdb-container class="px-0" fluid style="height: 100vh; background-color: #023E73; overflow-x: hidden">
      <notifications group="message" />
      <mdb-navbar v-if="loggedIn" color="amber darken-2" class="white-text" dark>
        <mdb-navbar-brand href="https://mdbootstrap.com/"><router-link style="color: white" to="/"></router-link>
        </mdb-navbar-brand>
        <mdb-navbar-toggler>
          <mdb-navbar-nav>
            <mdb-nav-item v-if="!userInfo.isLibrarian"><router-link to="/" class="mr-3 white-text">{{userInfo.firstName}} {{userInfo.lastName}} | Dashboard<mdb-icon icon="home" class="ml-2"></mdb-icon></router-link></mdb-nav-item>
            <mdb-nav-item v-else><router-link to="/admin" class="mr-3 white-text">Admin Dashboard<mdb-icon icon="home" class="ml-2"></mdb-icon></router-link></mdb-nav-item>
            <mdb-nav-item v-if="!userInfo.isLibrarian"><router-link to="/bookcatalog" class="mr-3 white-text">Book Catalog<mdb-icon icon="book" class="ml-2"></mdb-icon></router-link></mdb-nav-item>
            <mdb-nav-item v-else><router-link to="/adminbookcatalog" class="mr-3 white-text">Book Catalog<mdb-icon icon="book" class="ml-2"></mdb-icon></router-link></mdb-nav-item>
            <mdb-nav-item v-if="userInfo.isLibrarian"><router-link to="/adminadduser" class="mr-3 white-text">Add User<mdb-icon icon="plus" class="ml-2"></mdb-icon></router-link></mdb-nav-item>
            <mdb-nav-item v-if="userInfo.isLibrarian"><router-link to="/adminviewusers" class="mr-3 white-text">View Users<mdb-icon icon="users" class="ml-2"></mdb-icon></router-link></mdb-nav-item>
          </mdb-navbar-nav>
          <mdb-navbar-nav right>
            <mdb-nav-item v-if="!userInfo.isLibrarian"><mdb-icon icon="shopping-cart" @click.native="viewCart" title="View Cart"></mdb-icon></mdb-nav-item>
            <mdb-nav-item tag="a" @click.native="logOut">Log Out</mdb-nav-item>
          </mdb-navbar-nav>
        </mdb-navbar-toggler>
      </mdb-navbar>
      <mdb-row v-else class="justify-content-center align-items-center h-100">
        <mdb-col col="5">
          <mdb-card>
            <mdb-card-header class="pt-4 text-center" color="amber darken-2"><h3>Welcome!</h3></mdb-card-header>
            <mdb-card-body>
              <mdb-row class="justify-content-center">
                <mdb-col col="8">
                  <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" class="form-control" v-model="username">
                  </div>
                  <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" class="form-control" v-model="password">
                  </div>
                  <div class="text-center">
                    <a class="blue-text" @click="showSignUpModal = true">Sign Up</a>
                  </div>
                  <mdb-row class="justify-content-center pt-2">
                    <mdb-btn color="amber" @click.native="logIn">Log In</mdb-btn>
                  </mdb-row>
                </mdb-col>
              </mdb-row>
            </mdb-card-body>
          </mdb-card>
        </mdb-col>
      </mdb-row>
      <mdb-modal :show="showSignUpModal" @close="showSignUpModal = false" class="black-text" size="lg" centered>
        <mdb-modal-header color="amber darken-2">
          <mdb-modal-title class="w-100">
            Sign Up (all fields required)
          </mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <mdb-row>
            <mdb-col col="6">
              <div class="form-group">
                <label for="firstname">First Name</label>
                <input type="text" id="firstname" class="form-control" v-model="firstName">
              </div>
            </mdb-col>
            <mdb-col col="6">
              <div class="form-group">
                <label for="lastname">Last Name</label>
                <input type="text" id="lastname" class="form-control" v-model="lastName">
              </div>
            </mdb-col>
          </mdb-row>
          <mdb-row>
            <mdb-col col="12">
              <div class="form-group">
                <label for="address">Address</label>
                <input type="text" id="address" class="form-control" v-model="address">
              </div>
            </mdb-col>
          </mdb-row>
          <mdb-row>
            <mdb-col col="5">
              <div class="form-group">
                <label for="city">City</label>
                <input type="text" id="city" class="form-control" v-model="city">
              </div>
            </mdb-col>
            <mdb-col col="5">
              <div class="form-group">
                <label for="state">State</label>
                <input type="text" id="state" class="form-control" v-model="state">
              </div>
            </mdb-col>
            <mdb-col col="2">
              <div class="form-group">
                <label for="zip">Zip Code</label>
                <input type="number" id="zip" class="form-control" v-model="zip">
              </div>
            </mdb-col>
          </mdb-row>
          <mdb-row>
            <mdb-col col="8">
              <label for="email">Email</label>
              <input type="text" id="email" class="form-control" v-model="email">
            </mdb-col>
            <mdb-col col="4">
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="number" id="phone" class="form-control" v-model="phone">
              </div>
            </mdb-col>
          </mdb-row>
          <mdb-row>
            <mdb-col col="8">
              <label for="email">Username</label>
              <input type="text" id="newUsername" class="form-control" v-model="username">
            </mdb-col>
            <mdb-col col="4">
              <div class="form-group">
                <label for="phone">Password</label>
                <input type="password" id="newPassword" class="form-control" v-model="password">
              </div>
            </mdb-col>
          </mdb-row>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn outline="amber" @click.native="showSignUpModal = false">Cancel</mdb-btn>
          <mdb-btn
              color="amber"
              v-if="firstName && lastName && address && phone && city && state && zip && email && username && password" @click.native="register">Sign Up
          </mdb-btn>
          <mdb-btn v-else disabled color="amber">Sign Up</mdb-btn>
        </mdb-modal-footer>
      </mdb-modal>
      <mdb-modal :show="showCart" @close="showCart = false" class="black-text" size="fluid" centered>
        <mdb-modal-header color="amber darken-2">
          <mdb-modal-title class="w-100">
            Books in Cart
          </mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <vue-good-table
              :columns="columns"
              :rows="cart"
              :search-options="{enabled: true}"
              class="pt-4"
              style="padding-top: 80px !important"
          >
            <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'removeFromCart'">
          <mdb-btn outline="danger" size="sm" class="px-2" @click.native="removeFromCart(props.row)" title="Remove"><mdb-icon icon="minus-square"></mdb-icon></mdb-btn>
    </span>
              <span v-else>
      {{props.formattedRow[props.column.field]}}
    </span>
            </template>
          </vue-good-table>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn outline="amber" @click.native="showCart = false">Close</mdb-btn>
        </mdb-modal-footer>
      </mdb-modal>
      <router-view
          v-if="loggedIn"
          :headers="headers"
          :userInfo="userInfo"
          @update-cart = "updateCart"
          style="margin-top: -60px !important"/>
    </mdb-container>
</template>

<script>
import axios from "axios";
import moment from 'moment';

export default {
  name: 'App',
  data() {
    return {
      userInfo: null,
      loggedIn: false,
      userType: null,
      username: '',
      password: '',
      showSignUpModal: false,
      firstName: null,
      lastName: null,
      phone: null,
      address: null,
      state: null,
      city: null,
      zip: null,
      email: null,
      cart: [],
      showCart: false,
      columns: [
        {label: 'Book ID', field: 'bookID'},
        {label: 'ISBN', field: 'isbn'},
        {label: 'Title', field: 'title'},
        {label: 'Author', field: 'author'},
        {label: 'Publisher', field: 'publisher'},
        {label: 'Genre', field: 'genre'},
        {label: 'Date Added', field: 'dateAdded'},
        {label: 'Date Modified', field: 'dateModified'},
        {label: '', field: 'removeFromCart'},
      ],
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8081',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
  },
  methods: {
    async logIn() {
      let params = {
        username: this.username,
        password: this.password
      }
      await axios
          .post('http://localhost:8080/login', params, {headers: this.headers})
          .then(response => (this.userInfo = response.data))
      /*this.userInfo = {
        "userID": 1,
        "firstName": "Mitch",
        "lastName": "Johnson",
        "streetAddress": "220 Mapple Street",
        "city": "Oakdale",
        "state": "MN",
        "zipcode": 55113,
        "phone": "6121001000",
        "membershipDate": null,
        "isLibrarian": true
      }*/
      /*this.cart = [
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
      if(this.userInfo.userID) {
        if(this.userInfo.isLibrarian) {
          this.$router.push({path: '/admin'});
        }
        else {
            if(this.$router.currentRoute.fullPath != '/') {
              this.$router.push({ path: '/' })
            }
          }
        this.loggedIn = true;
        }
      else {
        this.$notify({
          group: 'message',
          title: 'Error',
          text: 'Could not log in.  Try again or register.',
          type: 'error'
        });
        this.loggedIn = false;
      }
    },
    logOut() {
      this.userInfo = null;
      this.loggedIn = false;
      this.userType = null;
      this.username = '';
      this.password = '';
      if(this.$router.currentRoute.fullPath != '/') {
        this.$router.push({ path: '/' })
      }
    },
    async register() {
      let params = {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        password: this.password,
        streetAddress: this.address,
        city: this.city,
        state: this.state,
        zipcode: this.zip,
        phone: this.phone,
        membershipDate: moment(),
        isLibrarian: false
      }
      await axios
          .post('http://localhost:8080/register', params, {headers: this.headers})
          .then(response => (this.userInfo = response.data));
      if(this.userInfo) {
        this.$notify({
          group: 'message',
          title: 'Success!',
          text: 'You have registered!',
          type: 'success'
        });
        this.showSignUpModal = false;
        await this.logIn();
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
    updateCart(book) {
      this.cart.push(book);
      this.$notify({
        group: 'message',
        title: 'Success',
        text: 'Book added to cart',
        type: 'success'
      });
    },
    viewCart() {
      this.showCart = true;
    },
    removeFromCart(book) {
      for(let i = 0; i< this.cart.length; i++) {
        if(this.cart[i].bookID == book.bookID) {
          this.cart.splice(i, 1);
        }
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

#app {
  text-align: center;
  margin-top: 150px;
}
</style>
