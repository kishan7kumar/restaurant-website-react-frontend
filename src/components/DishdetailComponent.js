import React, {Component} from 'react';
import { Card, CardImg,CardText, CardBody,CardTitle, Breadcrumb, BreadcrumbItem,Button ,Modal, ModalHeader, Row, Col, Label, ModalBody } from 'reactstrap';
import {Link} from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

function RenderComments({comments , postComment, dishId}) {
    // var commentlist = [""];
    if (comments != null){
        const commentlist = comments.map((comments) => 
         
           <Fade in> 
            <ul className="list-unstyled" key={comments.id}>
            <li>{comments.comment}</li>
            <li>-- {comments.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comments.date)))}</li>
            </ul> 
            </Fade>
               
        
        );
        /* NOTE: Alternate way of using map function */
        // for(var i=0; i<comments.length;i++){
        //       var contetn = {};
        //       contetn = <ul className="list-unstyled" key={comments[i].id}>
        //                 <li>{comments[i].comment}</li>
        //                 <li>-- {comments[i].author}, {comments[i].date}</li>
        //                 </ul>;

        //       commentlist.push(contetn);
        // }
        return(
            <div>
            <h4>Comments</h4>
            <div> <Stagger in>{commentlist}</Stagger></div> 
            <CommentForm dishId={dishId} postComment={postComment}></CommentForm>                   
            </div>
        ) ; 
    }

    else{
        return(<div> <CommentForm ></CommentForm></div>);
    }
}


function RenderDish({dish}){
    return(
        <FadeTransform
        in
        transformProps={{
            exitTransform: 'scale(0.5) translateY(-50%)'
        }}>
    <Card>
        <CardImg top src={baseUrl + dish.image} alt={dish.name} />
        <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
        </CardBody>
    </Card>
    </FadeTransform>
    );
}

/* -------------------------------------------------------------------------- */
/*                     NOTE - COMMENT FORM CLASS COMPONENT DEFINED HERE       */
/* -------------------------------------------------------------------------- */

class CommentForm extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        }

        toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
        }

        handleSubmit(values) {
            this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        }


render(){
    return(

        <div>
            <Button outline color="secondary" onClick={this.toggleModal} ><i class="fas fa-pencil-alt mr-2"></i>Submit Comment</Button>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                            <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                            <ModalBody>
                            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                        <Label htmlFor="rating" md={12}>Rating</Label>
                                        <Col md={12}>
                                            <Control.select model=".rating" id="rating" name="rating"
                                                placeholder="Rating"
                                                className="form-control" defaultValue="5">
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                        </Control.select>
                                        </Col>
                                    </Row>

                            <Row className="form-group">
                                        <Label htmlFor="author" md={12}>Your Name</Label>
                                        <Col md={12}>
                                            <Control.text model=".author" id="author" name="author"
                                                placeholder="Your Name"
                                                className="form-control"
                                                validators={{
                                                    required, minLength: minLength(3), maxLength: maxLength(15)
                                                }}
                                                />
                                            <Errors
                                                className="text-danger"
                                                model=".author"
                                                show="touched"
                                                messages={{
                                                    required: 'Required! ',
                                                    minLength: 'Must be greater than 2 characters',
                                                    maxLength: 'Must be 15 characters or less'
                                                }}
                                            />
                                        </Col>
                                    </Row>

                            
                                    <Row className="form-group">
                                        <Label htmlFor="comment" md={12}>Comment</Label>
                                        <Col md={12}>
                                            <Control.textarea model=".comment" id="comment" name="comment"
                                                rows="6"
                                                className="form-control" />
                                        </Col>
                                    </Row>
                                    <Row className="form-group">
                                        <Col md={{size:10, offset: 0}}>
                                            <Button type="submit" color="primary">
                                            Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </LocalForm>
                            
                            </ModalBody>
                        </Modal>
            </div>
    )
}

}
            



const  DishDetail = (props) => {

        var currentSelectedDish  = props.dish;
        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (currentSelectedDish != null)
            {
                return(
                            <div className="container">
                                <div className="row">
                                    <Breadcrumb>

                                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                                                <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                                        </Breadcrumb>
                                        <div className="col-12">
                                            <h3>{props.dish.name}</h3>
                                            <hr />
                                        </div>                
                                    </div>
                                <div className="row">
                                    <div className="col-12 col-md-5 m-1">
                                    <RenderDish dish={currentSelectedDish}></RenderDish>
                                    </div>
                                    <div className="col-12 col-md-5 m-1">                               
                                    <RenderComments comments={props.comments} postComment={props.postComment}
        dishId={props.dish.id}></RenderComments> 
                                                                                                   
                                    </div>
                                </div>  
                            </div>
                
                );
            }
            
        else{
        return (<div></div>);
        }
                                    
    };
            
           
            


        
    export default DishDetail ;