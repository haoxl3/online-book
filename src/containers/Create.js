import React from 'react';

// match获取路由上的参数
const Create = ({match}) => {
    return <h1>create page {match.params.id}</h1>
}

export default Create