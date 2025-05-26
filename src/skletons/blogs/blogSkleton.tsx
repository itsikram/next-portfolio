import React from 'react';

const PortfolioSkleton = ({ count = 1 }) => {
    return Array(count).fill(0).map((_, index) => (
        <div key={index} className='blog-item'>
            <div className="skeleton-card ">
                {/* Header */}
                {/* Main Content */}
                <div className="skeleton-main" />

                {/* Footer */}
                <div className="skeleton-header">
                    <div className="skeleton-lines">
                        <div className="skeleton-line large" />
                        <div className="skeleton-line medium" />
                    </div>
                </div>
            </div>
        </div>

    ));
}

export default PortfolioSkleton;
