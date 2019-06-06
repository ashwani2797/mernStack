const styles = theme => ({
    title: {
        fontSize: '20px',
        height: '50px',
        borderBottom: '4px solid lightgrey',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageArea: {
        borderBottom: '4px solid #274496',
        height: '600px',
        overflowY: 'scroll',
        marginTop: '20px',
        paddingLeft: '20px',
        paddingRight: '20px'
    },
    marginLeft: {
        marginLeft: '10px'
    },
    messageBody: {
        display: 'flex',
        alignItems: 'center'
    },
    messageBodySelf: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    message: {
        margin: '10px',
        color: 'white',
        backgroundColor: '#4153b6',
        border: '4px solid #4153b6',
        borderRadius: '5px',
        padding: '2px',
        width: 'fit-content',
    },
    authorBody: {
        margin: '1px',
        marginLeft: '2px',
        padding: '2px',
        width: 'fit-content',
    }
});

export default styles;