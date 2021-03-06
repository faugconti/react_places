import React, { useState, useContext, Fragment } from "react";
import {
  Card,
  Modal,
  LoadingSpinner,
  ErrorModal,
  Map,
} from "../../shared/components/UIElements";
import { Button } from "../../shared/components/FormElements";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
// import { useHistory } from "react-router-dom";
import classes from "./PlaceItem.module.css";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const canceldeleteHandler = () => {
    console.log(showMap);
    setShowConfirmModal(false);
  };
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: `Bearer ` + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass={classes.placeItemModalContent}
        footerClass={classes.placeItemModalActions}
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className={classes.MapContainer}>
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={canceldeleteHandler}
        header="Are you sure?"
        footerClass={classes.placeItemModalActions}
        footer={
          <Fragment>
            <Button inverse onClick={canceldeleteHandler}>
              CANCEL
            </Button>
            <Button
              danger
              onClick={confirmDeleteHandler}
              externalClass={classes.ModalButtonDelete}
            >
              DELETE
            </Button>
          </Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          cannot be undone thereafter
        </p>
      </Modal>
      <li className={classes.PlaceItem}>
        <Card className={classes.Content}>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className={classes.Image}>
            <img
            src={props.image}
              // src={`${process.env.REACT_APP_BACKEND_ASSETS_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className={classes.Info}>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className={classes.Actions}>
            <Button inverse onClick={openMapHandler}>
              MAP
            </Button>

            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};

export default PlaceItem;
