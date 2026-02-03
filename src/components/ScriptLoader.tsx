import { useEffect } from 'react';

export const ScriptLoader = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://app.lumi.education/api/v1/h5p/core/js/h5p-resizer.js";
        script.charset = "UTF-8";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        }
    }, []);

    return null;
};
