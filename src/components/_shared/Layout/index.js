import React, { useContext, useMemo } from "react";
import NavBar from "components/_shared/NavBar";
import "./styles.scss";
import { ContextModal } from "hooks/useModal";

import EditCard from "views/EditCard";
import EditProfile from "views/EditProfile";
import CreateCard from "views/CreateCard";

const Layout = ({ children }) => {
  const { isModalOpen, hiddenModal, id, component } = useContext(ContextModal);

  const modal = useMemo(() => {
    if (isModalOpen) {
      return (
        <div className="modals">
          <div className="modals__content">
            {component === "add-card" && <CreateCard />}
            {component === "edit-card" && <EditCard id={id} />}
            {component === "edit-profile" && <EditProfile id={id} />}
          </div>
        </div>
      )
    }
  }, [component, id, isModalOpen])

  return (
    <div className="layout">
      {modal}
      <main className="main">
        {children}
      </main>
      <NavBar onClick={hiddenModal} />
    </div>
  );
};

export default Layout;
