import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
  truncate: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
  },
  root: {
    boxShadow: "0 0 15px 10px #efefef",
    maxWidth: 350,
    margin: "15px",

    [theme.breakpoints.up('md')]: {
      maxWidth:325,
      margin: "6px 12px"
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth:300,
      margin: "10px"
    },
    transition: "0.5s",
    // "&:hover":{
    //   backgroundColor: "#ffd3e1",
    // }
  },
  media: {
    position:"relative",
    paddingTop: '56.25%', // 16:9
    transition:'0.5s',
    "&::before":{
      content:"",
      width:"100%",
      height:0,
      position:"absolute",
      top:0,
      left:0,
      backgroundColor: "rgba( 0, 0, 0, 0.3 )"
    },
    "&:hover":{
      "&::before":{
        content:"''",
        width:"100%",
        height:"100%",
        position:"absolute",
        top:0,
        left:0,
        backgroundColor: "rgba( 0, 0, 0, 0.3 )"
      }
    }
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));