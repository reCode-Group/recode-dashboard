import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from 'services/auth';
import { getOrganizationDetails } from 'services/organization';
import { AppMarkup } from './AppMarkup.jsx';
import {
  closeCodeFullModal,
  closeModal,
  closeProjectEditModal,
  copyFullCode,
  createNewProject,
  downloadFullCode,
  initModals,
  openCodeFullModal,
  openModal,
  openProjectEditModal,
  saveProjectName,
} from './modals.js';
import { initTips } from './tips.js';
import { initBlocklyApp } from './blocklyApp.js';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [viewerContext, setViewerContext] = useState(null);
  const [organization, setOrganization] = useState(null);

  const handlers = useMemo(
    () => ({
      openModal,
      openProjectEditModal,
      openCodeFullModal,
      closeModal,
      createNewProject,
      closeProjectEditModal,
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
        try {
          const currentUser = await getCurrentUser();
          if (isMounted) {
            setViewerContext(currentUser);
          }
          if (currentUser?.has_organization) {
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
        } catch {
          if (isMounted) {
            setViewerContext(null);
            setOrganization(null);
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
  }, []);

  return <AppMarkup handlers={handlers} isReady={isAppReady} viewerContext={viewerContext} organization={organization} />;
}
