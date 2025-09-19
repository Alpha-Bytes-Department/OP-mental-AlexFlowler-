import { useState } from 'react';

const useManageHistoryStatus = () => {
    const [saveHistory, setSaveHistory] = useState<boolean>(false);
    return {saveHistory,setSaveHistory};
};

export default useManageHistoryStatus;