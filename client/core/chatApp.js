import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { Directions } from 'material-ui-icons';

const styles = theme => ({
    mainDiv: {
        display: 'flex'
    },
    friendsList: {
        backgroundColor: 'red',
        width: '20%',
        height: '800px'
    },
    chatContainer: {
        backgroundColor: 'green',
        width: '50%'
    },
    groupMembers: {
        backgroundColor: 'yellow',
        width: '30%'
    }
});


class ChatApp extends Component {

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.mainDiv}>
                <div className={classes.friendsList}>Friends</div>
                <div className={classes.chatContainer}>Chat box</div>
                <div className={classes.groupMembers}>Group members</div>
            </div>
        );
    };

};

export default withStyles(styles)(ChatApp);

