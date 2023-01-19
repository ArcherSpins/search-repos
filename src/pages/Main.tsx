/* eslint-disable jsx-a11y/anchor-has-content */
import { Card as CardAntd, Col, Input, Pagination, Row } from 'antd';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MAIN_PATH } from '../routes';
import { RepoType } from '../types';
import { API_URL, TOKEN } from '../consts';

const { Search } = Input;

const Header = styled.div`
    padding: 40px;
    background-color: #24292f;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 150px;
`;

const Container = styled.div`
    padding: 40px;
    justify-content: center;
    display: ${({ displayType }: { displayType?: string }) => displayType || 'flex'};
`;

const DataImg = styled.img`
    width: 60%;
`;

const Card = styled(CardAntd)`
    margin-bottom: 20px;
    transition: .4s;

    &:hover {
        box-shadow: 0px 5px 5px 1px rgba(0,0,0,0.2);
    }
`;

const Link = styled.a`
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
`;

const Page = styled.div`
    padding-bottom: 10px;
`;

export const MainPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState<RepoType[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const queryParams = useMemo(() => Object.fromEntries(new URLSearchParams(window.location.search).entries()) as unknown as { [key: string]: string }, [window.location.search]);

    const getQueryParams = useCallback((newParams?: { [key: string]: string }) => {
        const paramsToSet = { ...queryParams, ...newParams };
        return Object.keys(paramsToSet).filter((key) => key !== 'search').reduce((str, key, idx) => idx === 0 ? `?${key}=${paramsToSet[key]}` : str + `${key}=${paramsToSet[key]}`, '');
    }, [queryParams]);

    const handleSearch = (val: string) => {
        navigate(`${MAIN_PATH}${val}${getQueryParams(queryParams)}`)
    }

    const handleChangePage = (page: number) => {
        navigate(`${location.pathname}${getQueryParams({ ...queryParams, page: String(page) })}`)
    }

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/search/repositories?q=${params.search}&per_page=10&page=${queryParams.page || 1}`, {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${TOKEN}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data.items);
                setTotalCount(data.total_count);
            })
            .finally(() => setLoading(false));
    }, [params, queryParams]);

    const renderContent = () => {
        if (loading) {
            return (
                <Container>
                    <DataImg src="https://cdn.lowgif.com/full/d8529a563547479a-.gif" alt="loading" />
                </Container>
            )
        }

        if (!data.length) {
            return (
                <Container>
                    <DataImg src="https://avatars.mds.yandex.net/i?id=4afc52641c1cd898ae851248b77d91b5cdd68e8d-6997554-images-thumbs&n=13" alt="No data" />
                </Container>
            )
        }

        return (
            <Container displayType='block'>
                {data.map((item) => (
                    <Card bordered={true}>
                        <Link href={item.html_url} target="_blank" rel="noreferrer">{item.name}</Link>
                        <Row>
                            <Col span={6}>
                                Owner: <b>{item.owner.login}</b>
                            </Col>
                            <Col span={6}>
                                Forks: <b>{item.forks}</b>
                            </Col>
                            <Col span={6}>
                                Language: <b>{item.language}</b>
                            </Col>
                        </Row>
                        <div>
                            {item.description}
                        </div>
                    </Card>
                ))}
                <Pagination defaultCurrent={Number(queryParams.page) || 1} showSizeChanger={false} total={totalCount} onChange={handleChangePage} />
            </Container>
        );
    }

    return (
        <Page>
            <Header>
                <Search size="large" placeholder="Type text to search repos" defaultValue={params.search} onSearch={handleSearch} enterButton />
            </Header>
            {renderContent()}
        </Page>
    )
}
