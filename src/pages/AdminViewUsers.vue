<template>
  <mdb-container class="mt-0 pt-0 mb-0" fluid style="height: 100vh">
    <vue-good-table
        :isLoading="loading"
        :columns="columns"
        :rows="rows"
        :search-options="{enabled: true}"
        class="pt-4"
        style="margin-top: 80px !important"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'update'">
          <mdb-btn outline="amber" size="sm" class="px-2" @click.native="updateUserModal(props.row)" title="Update User"><mdb-icon icon="edit"></mdb-icon></mdb-btn>
    </span>
        <span v-if="props.column.field == 'delete'">
          <mdb-btn outline="danger" size="sm" class="px-2" @click.native="deleteUserModal(props.row)" title="Delete User"><mdb-icon icon="trash"></mdb-icon></mdb-btn>
    </span>
        <span v-else>
      {{props.formattedRow[props.column.field]}}
    </span>
      </template>
    </vue-good-table>
    <mdb-modal v-if="userToUpdate" :show="showUpdateModal" @close="showUpdateModal = false" class="black-text" size="lg" centered>
      <mdb-modal-header color="amber darken-2">
        <mdb-modal-title class="w-100">
          Update User
        </mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-row class="justify-content-end pb-2">
          <div class="custom-control custom-control-inline">User Type: </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" name="usertype" class="custom-control-input" id="admin" value="admin" v-model="userToUpdate.userType">
            <label class="custom-control-label" for="admin">Admin</label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" name="usertype" class="custom-control-input" id="user" value="user" v-model="userToUpdate.userType">
            <label class="custom-control-label" for="user">User</label>
          </div>
        </mdb-row>
        <mdb-row>
          <mdb-col col="6">
            <div class="form-group">
              <label for="firstname">First Name</label>
              <input type="text" id="firstname" class="form-control" v-model="userToUpdate.firstName">
            </div>
          </mdb-col>
          <mdb-col col="6">
            <div class="form-group">
              <label for="lastname">Last Name</label>
              <input type="text" id="lastname" class="form-control" v-model="userToUpdate.lastName">
            </div>
          </mdb-col>
        </mdb-row>
        <mdb-row>
          <mdb-col col="12">
            <div class="form-group">
              <label for="address">Address</label>
              <input type="text" id="address" class="form-control" v-model="userToUpdate.streetAddress">
            </div>
          </mdb-col>
        </mdb-row>
        <mdb-row>
          <mdb-col col="5">
            <div class="form-group">
              <label for="city">City</label>
              <input type="text" id="city" class="form-control" v-model="userToUpdate.city">
            </div>
          </mdb-col>
          <mdb-col col="5">
            <div class="form-group">
              <label for="state">State</label>
              <input type="text" id="state" class="form-control" v-model="userToUpdate.state">
            </div>
          </mdb-col>
          <mdb-col col="2">
            <div class="form-group">
              <label for="zip">Zip Code</label>
              <input type="number" id="zip" class="form-control" v-model="userToUpdate.zipcode">
            </div>
          </mdb-col>
        </mdb-row>
        <mdb-row>
          <mdb-col col="4">
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input type="number" id="phone" class="form-control" v-model="userToUpdate.phone">
            </div>
          </mdb-col>
          <mdb-col col="4">
            <div class="form-group">
              <label for="membershipDate">Membership Date</label>
              <input type="text" id="membershipDate" class="form-control" v-model="userToUpdate.membershipDate">
            </div>
          </mdb-col>
        </mdb-row>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn
            color="amber"
            v-if="userToUpdate.firstName && userToUpdate.lastName && userToUpdate.streetAddress && userToUpdate.phone && userToUpdate.city && userToUpdate.state && userToUpdate.zipcode" @click.native="updateUser">Update User
        </mdb-btn>
        <mdb-btn v-else disabled color="amber">Update User</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal v-if="userToDelete" :show="showDeleteModal" @close="showDeleteModal = false" class="black-text" centered>
      <mdb-modal-header color="danger-color">
        <mdb-modal-title class="w-100">
          Delete User
        </mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <p>Are you sure you want to delete {{userToDelete.firstName}} {{userToDelete.lastName}}?</p>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn outline="amber" @click.native="showDeleteModal = false">Cancel</mdb-btn>
        <mdb-btn color="danger" @click.native="deleteUser">Delete User</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </mdb-container>
</template>

<script>

import axios from "axios";
import moment from "moment";

export default {
  name: "AdminViewUsers",
  props: {
    userInfo: Object,
    headers: Object
  },
  data() {
    return {
      loading: true,
      showUpdateModal: false,
      userToUpdate: null,
      showDeleteModal: false,
      userToDelete: null,
      columns: [
        {label: 'User ID', field: 'userID'},
        {label: 'First Name', field: 'firstName'},
        {label: 'Last Name', field: 'lastName'},
        {label: 'Street Address', field: 'streetAddress'},
        {label: 'City', field: 'city'},
        {label: 'State', field: 'state'},
        {label: 'Zipcode', field: 'zipcode'},
        {label: 'Phone', field: 'phone'},
        {label: 'Membership Date', field: 'membershipDate'},
        {label: 'User Type', field: 'userType'},
        {label: '', field: 'update'},
        {label: '', field: 'delete'},
      ],
      rows: null
    }
  },
  methods: {
    async getUsers() {
      await axios
          .get('http://localhost:8080/users', {headers: this.headers})
          .then(response => (this.rows = response.data))
      /*this.rows = [
        {
          "userID": 1,
          "firstName": "Mitch",
          "lastName": "Johnson",
          "streetAddress": "220 Mapple Street",
          "city": "Oakdale",
          "state": "MN",
          "zipcode": 55113,
          "phone": "6121001000",
          "membershipDate": null,
          "isLibrarian": false
        },
        {
          "userID": 2,
          "firstName": "Elana",
          "lastName": "Fridley",
          "streetAddress": "12th Street S",
          "city": "Oakdale",
          "state": "MN",
          "zipcode": 55113,
          "phone": "6511001000",
          "membershipDate": "2001-10-10T05:00:00.000+00:00",
          "isLibrarian": false
        }
      ]*/
      for (let i = 0; i < this.rows.length; i++) {
        if(this.rows[i].isLibrarian) {
          this.rows[i].userType = 'Librarian';
        }
        else {
          this.rows[i].userType = 'User'
        }
        if(this.rows[i].membershipDate) {
          this.rows[i].membershipDate = moment(this.rows[i].membershipDate).format("MM/DD/YYYY");
        }
      }
      this.loading = false;
    },
    updateUserModal(user) {
      this.userToUpdate = user;
      if(this.userToUpdate.isLibrarian) {
        this.userToUpdate.userType = 'admin'
      }
      else {
        this.userToUpdate.userType = 'user'
      }
      this.showUpdateModal = true;
    },
    async updateUser() {
      let updateResponse;
      let params = {
        userID: this.userToUpdate.userID,
        firstName: this.userToUpdate.firstName,
        lastName: this.userToUpdate.lastName,
        streetAddress: this.userToUpdate.streetAddress,
        city: this.userToUpdate.city,
        state: this.userToUpdate.state,
        zipcode: this.userToUpdate.zipcode,
        phone: this.userToUpdate.phone,
        membershipDate: null,
        isLibrarian: this.userToUpdate.userType == 'user' ? false : true
      }

      await axios
          .put('http://localhost:8080/users/' + this.userToUpdate.userID, params, {headers: this.headers})
          .then(response => (updateResponse = response.data))
      if(updateResponse) {
        this.$notify({
          group: 'message',
          title: 'Success!',
          text: 'User has been updated!',
          type: 'success'
        });
        this.showUpdateModal = false;
        await this.getUsers();
      }
      else {
        this.$notify({
          group: 'message',
          title: 'Error',
          text: 'Oops!  Something went wrong',
          type: 'error'
        });
      }
    },
    deleteUserModal(user) {
      this.userToDelete = user
      this.showDeleteModal = true;
    },
    async deleteUser() {
      let userDeleted;
      await axios
          .delete('http://localhost:8080/users/' + this.userToDelete.userID, {headers: this.headers})
          .then(response => (userDeleted = response))
      if(userDeleted.status === 200) {
        this.$notify({
          group: 'message',
          title: 'Success!',
          text: 'User has been deleted!',
          type: 'success'
        });
        this.showDeleteModal = false;
        await this.getUsers();
      }
      else {
        this.$notify({
          group: 'message',
          title: 'Error',
          text: 'Oops!  Something went wrong',
          type: 'error'
        });
      }
    }
  },
  mounted() {
    this.getUsers();
  }
}
</script>

<style scoped>

</style>