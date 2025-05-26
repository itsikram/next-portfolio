import React, { useEffect, useState } from 'react';
type ProgressBarProps = {
  title: string;
  percent: number;
};

const ProgressBar = ({ title, percent }: ProgressBarProps) => {

    const [progress, setProgress] = useState(0)

    useEffect(() => {

        const progressInterval = setInterval(() => {
            if (progress <= percent && progress <= 100) {
                setProgress(progress => progress + 1)
            }

        }, 5)

        return () => clearInterval(progressInterval);
    }, [progress,percent])

    return (
        <>

            <div className='progress-bar-container'>
                <h4 className='progress-bar-title'>{title}</h4>
                <div className='bar-container'>
                    <div className='progress-bar'>
                        <div style={{ width: `${progress}%` }} className='progress-bar-indicator'></div>
                    </div>
                    <span className='percent-holder'> {progress}%</span>
                </div>

            </div>
        </>
    );
}

export default ProgressBar;
