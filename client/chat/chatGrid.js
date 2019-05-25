import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import { read } from '../user/api-user.js';
import auth from '../auth/auth-helper';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import ViewIcon from 'material-ui-icons/Visibility';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import ChatBox from './chatBox';
import _ from 'lodash';



const styles = theme => ({
    mainDiv: {
        display: 'flex',
        margin: '20px'
    },
    friendsList: {
        backgroundColor: 'white',
        width: '30%',
        height: '800px',
        fontWeight: '900',
        textAlign: 'center',
        fontSize: '20px',
        borderRight: '4px solid lightgray',
        paddingRight: '20px'
    },
    chatContainer: {
        width: '40%',
        borderRight: '4px solid lightgray',
        marginRight: '20px',
        paddingRight: '20px',
        paddingLeft: '20px'
    },
    groupMembers: {
        width: '30%'
    },
    title: {
        fontSize: '20px',
        height: '50px',
        borderBottom: '4px solid lightgrey',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});


class ChatApp extends Component {


    state = {
        followers: [],
        following: [],
        user: null,
        friends: [],
        loading: true,
        activeUser: { name: "no_user" }
    }


    componentDidMount = () => {
        this.init();
    };
    init = () => {
        const jwt = auth.isAuthenticated()
        read({
            userId: jwt.user._id
        }, { t: jwt.token }).then((data) => {
            if (data.error) {
                this.setState({ redirectToSignin: true })
            } else {
                console.log(data);
                let friends = _.uniqBy(data.followers.concat(data.following),'_id');
                console.log(friends);
                this.setState({ user: data, friends: friends, loading: false});
            }
        })
    }

    selectUser = (user) => {
        this.setState({ activeUser: user });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.mainDiv}>
                <div className={classes.friendsList}>
                    <Typography type="title" className={classes.title}>
                        Followers and Following
                </Typography>
                    <List>
                        {this.state.friends.map((item, i) => {
                            return <span key={i}>
                                <ListItem>
                                    <ListItemAvatar className={classes.avatar}>
                                        <Avatar src={'/api/users/photo/' + item._id} />
                                    </ListItemAvatar>
                                    <ListItemText primary={item.name} />
                                    <ListItemSecondaryAction className={classes.follow}>
                                        <Link to={"/user/" + item._id}>
                                            <IconButton variant="raised" color="secondary" className={classes.viewButton}>
                                                <ViewIcon />
                                            </IconButton>
                                        </Link>
                                        <Button aria-label="Follow" color="primary" onClick={() => this.selectUser(item)}>
                                            <i className="material-icons">
                                                chat
                                            </i>
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                            </span>
                        })
                        }

                    </List>


                </div>
                <div className={classes.chatContainer}>
                   { this.state.loading || <ChatBox activeUser={this.state.activeUser} user={this.state.user} />}
                   { this.state.loading && <div> Loading....</div>}
                </div>
                <div className={classes.groupMembers}>Group members</div>
            </div>
        );
    };

};

export default withStyles(styles)(ChatApp);

