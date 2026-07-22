import { useEffect, useMemo, useState } from 'react';
import { getOrganizationDetails } from 'services/organization';
import { AppMarkup } from './AppMarkup.jsx';
import {
  closeCodeFullModal,
  closeModal,
  closeProjectDeleteModal,
  closeProjectCreateModal,
  closeProjectEditModal,
  confirmProjectCreation,
  confirmProjectDeletion,
  copyFullCode,
  createNewProject,
  downloadFullCode,
  initModals,
  openCodeFullModal,
  openModal,
  openProjectDeleteModal,
  openProjectEditModal,
  saveProjectName,
} from './modals.js';
import { initTips } from './tips.js';
import { initBlocklyApp } from './blocklyApp.js';

export default function App({ viewerContext }) {
  const [isAppReady, setIsAppReady] = useState(false);
  const [organization, setOrganization] = useState(null);

  const handlers = useMemo(
    () => ({
      openModal,
      openProjectEditModal,
      openCodeFullModal,
      closeModal,
      createNewProject,
      closeProjectCreateModal,
      confirmProjectCreation,
      closeProjectEditModal,
      openProjectDeleteModal,
      closeProjectDeleteModal,
      confirmProjectDeletion,
      saveProjectName,
      closeCodeFullModal,
      copyFullCode,
      downloadFullCode,
    }),
    [],
  );

  useEffect(() => {
    const cleanups = [];
    const registerCleanup = (cleanup) => {
      if (typeof cleanup === 'function') {
        cleanups.push(cleanup);
      }
    };

    let isMounted = true;

    const bootstrap = async () => {
      try {
        if (viewerContext?.has_organization) {
          try {
            const organizationDetails = await getOrganizationDetails();
            if (isMounted) {
              setOrganization(organizationDetails);
            }
          } catch {
            if (isMounted) {
              setOrganization(null);
            }
          }
        }

        registerCleanup(initModals());
        registerCleanup(initTips());

        const blocklyCleanup = await initBlocklyApp();
        if (!isMounted) {
          if (typeof blocklyCleanup === 'function') blocklyCleanup();
          return;
        }

        registerCleanup(blocklyCleanup);

        await new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        });

        // Give icon fonts a small extra window to finish painting.
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (isMounted) {
          setIsAppReady(true);
        }
      } catch (error) {
        console.error('App initialization error:', error);
        if (isMounted) {
          setIsAppReady(true);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
      cleanups.reverse().forEach((cleanup) => {
        if (typeof cleanup === 'function') cleanup();
      });
    };
  }, [viewerContext]);

  return <AppMarkup handlers={handlers} isReady={isAppReady} viewerContext={viewerContext} organization={organization} />;
}
