import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getNavigationOptions } from '../../themes/appTheme';
import { User } from '../../database';
import * as Colors from '../../themes/colors';

class UserScreen extends Component {

  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.state = {
      users: null,
      refreshing: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getAllUsers();
  }

  onRefresh() {
    this.setState({ refreshing: true });
    User.getAll().then((users) => {
      this.setState({ users, refreshing: false });
    });
  }

  getAllUsers() {
    User.getAll().then((users) => {
      this.setState({ users });
      this.setState({ isLoading: false });
    });
  }

  keyExtractor = item => item.id;
  itemSeparator = ({ highlighted }) => (
    <View style={[styles.separator, highlighted && { marginLeft: 0 }]} />
  )

  deleteUser(id) {
    User.remove(id).then(() => {
      console.log('User is removed!');
      this.getAllUsers();
    });
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => this.deleteUser(item.id)}>
        <View style={styles.item}>
          <View style={styles.avatar}>
            <Text>{item.name[0]}</Text>
          </View>
          <View style={styles.info}>
            <View style={styles.infoContent}><Text style={{ fontSize: 18 }}>{item.name}</Text></View>
            <View style={styles.infoContent}><Text>{item.email}</Text></View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          ItemSeparatorComponent={this.itemSeparator}
          data={this.state.users}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
        />
        {this.state.isLoading && <ActivityIndicator size="large" style={styles.loading} animating={this.state.isLoading} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  itemContainer: {
    flex: 1,
    padding: 10,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

UserScreen.navigationOptions = getNavigationOptions('Users', Colors.primary, 'white');

export default connect()(UserScreen);
