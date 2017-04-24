import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import Main from './main'
import {
  ButtonToolbar,
  Button,
  Panel,
  FormGroup,
  ControlLabel,
  FormControl,
  Form,
  Col
} from 'react-bootstrap';
const client = require('../api/client');

export class DetailItem extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isFile: false,
            item: null,
            name: null,
            tags: [],
            editMode: false
        }

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);

        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.addSubFolder = this.addSubFolder.bind(this);

        this.initTag = this.initTag.bind(this);
    }

    componentWillReceiveProps (props) {
        // reload with props item if item of state is not init or id is different or type is different
        if(props.item && (this.state.item == null || props.item.id != this.state.item.id || props.isFile != this.state.isFile)) {
            this.state.tags = [];
            this.setState({
                isFile: props.isFile,
                item: props.item,
                name: props.item.name
            });
            props.item.tags.forEach(this.initTag);
        }
    }

    initTag(tag) {
        this.state.tags.push({
            id: this.state.tags.length + 1,
            text: tag
        });
    }

    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }

    handleAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    }

    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    }

    handleChangeName(event) {
        this.setState({name: event.target.value});
    }

    edit(event) {
        event.preventDefault();

        this.setState({editMode: true});
    }

    delete(event) {
        event.preventDefault();

        if(confirm("Are you sure ?")) {
            if(this.props.isFile) {
                alert('TODO');

                /*client({method: 'DELETE', path: '/api/files/' + this.props.item.id}).done(response => {
                    //this.props.reload();

                    var element = document.getElementById("file_" + this.props.item.id);
                    element.parentNode.removeChild(element);

                    this.setState({
                        editMode: false,
                        item: null
                    });
                });*/
            } else {
                client({method: 'DELETE', path: '/api/directories/' + this.props.item.id}).done(response => {
                    //this.props.reload();

                    var element = document.getElementById("dir_" + this.props.item.id);
                    element.parentNode.removeChild(element);

                    this.setState({
                        editMode: false,
                        item: null
                    });
                });
            }
        }
    }

    save(event) {
        event.preventDefault();

        var item = {name: this.state.name, tags: []};
        this.state.tags.forEach(function(tag) {
            item.tags.push(tag.text);
        });

        if(this.props.isFile) {
            alert('TODO');
            /*client({method: 'POST', path: '/api/files/' + this.props.item.id, entity: item, headers: { 'Content-Type': 'application/json' }}).done(response => {
                this.props.reload();

                this.setState({
                    editMode: false,
                    item: response.entity
                });
            });*/
        } else {
            client({method: 'POST', path: '/api/directories/' + this.props.item.id, entity: item, headers: { 'Content-Type': 'application/json' }}).done(response => {
                this.props.reload();

                this.setState({
                    editMode: false,
                    item: response.entity
                });
            });
        }
    }

    addSubFolder() {
        alert('to be implemented !');
    }

    render() {
        if(this.state.item != null) {
            return (
                <div>
                    <Panel header={this.props.isFile ? "File": "Directory"} >
                        <Form horizontal onSubmit={this.save}>
                            <FieldGroup
                                id="name"
                                label="Name"
                                type="text"
                                placeholder="Enter name"
                                onChange={this.handleChangeName}
                                value={this.state.name}
                                readOnly={!this.state.editMode} />
                            <FieldGroup
                                id="createdBy"
                                label="Created by"
                                type="text"
                                value={this.state.item.createdBy ? this.state.item.createdBy.firstname + " " + this.state.item.createdBy.lastname : ""}
                                readOnly="true" />
                            <FieldGroup
                                id="createdDate"
                                label="Created date"
                                type="text"
                                value={this.state.item.createdDate}
                                readOnly="true" />
                            <FieldGroup
                                id="lastModifiedBy"
                                label="Last modified by"
                                type="text"
                                value={this.state.item.lastModifiedBy ? this.state.item.lastModifiedBy.firstname + " " + this.state.item.lastModifiedBy.lastname : ""}
                                readOnly="true" />
                            <FieldGroup
                                id="lastModifiedDate"
                                label="Last modified date"
                                type="text"
                                value={this.state.item.lastModifiedDate}
                                readOnly="true" />
                            <FieldGroup
                                id="path"
                                label="Path"
                                type="text"
                                value={this.state.item.path ? this.state.item.path : ""}
                                readOnly="true" />

                            <div>
                                <label>Tags</label>
                                <ReactTags tags={this.state.tags}
                                           handleDelete={this.handleDelete}
                                           handleAddition={this.handleAddition}
                                           handleDrag={this.handleDrag}
                                           readOnly={!this.state.editMode} />
                            </div>
                            <Actions displayEdit={!this.state.editMode}
                                     edit={this.edit}
                                     delete={this.delete}
                                     addSubFolder={this.addSubFolder}
                                     upload={this.props.upload}/>
                        </Form>
                    </Panel>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}

class Actions extends Component{
    render() {
        return (
            <ButtonToolbar>
                {this.props.displayEdit ? (
                    <Button bsStyle="primary" onClick={this.props.edit}>Edit</Button>
                ) : (
                    <Button bsStyle="primary" type="submit">Save</Button>
                )}
                <Button bsStyle="danger" onClick={this.props.delete}>Delete</Button>
                {this.props.addSubFolder &&
                <Button onClick={this.props.addSubFolder}>Add sub-folder</Button>
                }
                {this.props.upload &&
                <Button onClick={this.props.upload}>Upload</Button>
                }
            </ButtonToolbar>
        )
    }
}

function FieldGroup({ id, label, ...props }) {
  return (
    <FormGroup controlId={id}>
        <Col componentClass={ControlLabel} sm={3}>{label}</Col>
        <Col sm={9}>
            <FormControl {...props} />
        </Col>
    </FormGroup>
  );
}