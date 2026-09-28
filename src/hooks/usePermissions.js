import {useCallback, useEffect, useState} from 'react';
import {
  checkMediaPermission,
  isPermissionGranted,
  requestMediaPermission,
} from '../utils/permissions';

export function usePermissions() {
  const [status, setStatus] = useState(null);

  const refresh = useCallback(async () => {
    const next = await checkMediaPermission();
    setStatus(next);
    return next;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const request = useCallback(async () => {
    const result = await requestMediaPermission();
    setStatus(result.status);
    return result.status;
  }, []);

  return {
    status,
    granted: isPermissionGranted(status),
    refresh,
    request,
  };
}
