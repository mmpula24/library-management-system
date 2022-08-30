<template>
  <mdb-container class="mt-0 pt-0 mb-0" fluid style="height: 100vh">
    <mdb-row class="justify-content-center align-items-center h-100">
      <mdb-col col="8" style="margin-top: 60px">
        <mdb-card>
          <mdb-card-header class="text-center" color="amber darken-2"><h5>Add User</h5></mdb-card-header>
          <mdb-card-body>
            <mdb-row class="justify-content-end pb-2">
              <div class="custom-control custom-control-inline">User Type: </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" name="usertype" class="custom-control-input" id="admin" value="admin" v-model="newUserType">
                <label class="custom-control-label" for="admin">Admin</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" name="usertype" class="custom-control-input" id="user" value="user" v-model="newUserType">
                <label class="custom-control-label" for="user">User</label>
              </div>
            </mdb-row>
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
            <mdb-row class="justify-content-end">
              <mdb-btn
                  color="amber"
                  v-if="firstName && lastName && address && phone && city && state && zip && email && username && password" @click.native="register">Sign Up
              </mdb-btn>
              <mdb-btn v-else disabled color="amber">Sign Up</mdb-btn>
            </mdb-row>
          </mdb-card-body>
        </mdb-card>
      </mdb-col>
    </mdb-row>
  </mdb-container>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "AdminAddUser",
  props: {
    userInfo: Object,
    headers: Object
  },
  data() {
    return {
      firstName: null,
      lastName: null,
      phone: null,
      address: null,
      state: null,
      city: null,
      zip: null,
      email: null,
      username: null,
      password: null,
      newUserType: 'admin',
    }
  },
  methods: {
    async register() {
      let registered;
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
        isLibrarian: this.newUserType == 'user' ? false : true
      }
      await axios
          .post('http://localhost:8080/register', params, {headers: this.headers})
          .then(response => (registered = response.data));
      if(registered) {
        this.$notify({
          group: 'message',
          title: 'Success!',
          text: 'User has been registered!',
          type: 'success'
        });
      }
      else {
        this.$notify({
          group: 'message',
          title: 'Error',
          text: 'Something went wrong',
          type: 'error'
        });
      }
    }
  }
}
</script>

<style scoped>

</style>