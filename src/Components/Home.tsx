import {S3Image} from 'aws-amplify-react'
import * as React from 'react'
import {ChangeEvent, FormEvent} from "react"
import {ChildProps, MutationFn} from "react-apollo"
import Mutation from "react-apollo/Mutation"
import Query from "react-apollo/Query"
import {v4 as uuid} from "uuid"
import aws_exports from '../aws-exports'
import MutationPostImages from "../GraphQL/MutationPostImages"
import QueryGetImages from "../GraphQL/QueryGetImages"

interface IImage {
    id: string,
    timestamp: number | null,
}

interface IData {
    getImages: IImage[] | null,
    postImages: IImage | null,
}

interface IState {
    uploadFile: File | null
}

type Props = ChildProps<{}, IData>

class Home extends React.Component<Props, IState> {
    constructor(props: Props) {
        super(props);
        this.uploadImage = this.uploadImage.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    public render() {
        return (
            <div className="pure-g">
                <div className="text-box pure-u-1 pure-u-md-1 pure-u-lg-1 pure-u-xl-1">
                    <div className="l-box">
                        <h1 className="text-box-head">Photo Gallery</h1>
                        <p className="text-box-subhead">
                            A collection of various photos from around the world
                        </p>
                    </div>
                </div>
                <Query query={QueryGetImages}
                       fetchPolicy='cache-and-network'
                >
                    {({data, error, loading}) => {
                        if (error) {
                            return <p>{error.message}</p>
                        }
                        if (loading){
                            return <div />
                        }
                        return data.getImages.map((image: IImage) => {
                            return <div id={image.id}
                                        key={image.id}
                                        className="photo pure-u-1-3 pure-u-md-1-3 pure-u-lg-1-3 pure-u-xl-1-3"
                            >
                                {/*キーのみ指定しているので、publicフォルダから取得する*/}
                                <S3Image imgKey={`${image.id}`}/>
                            </div>
                        })
                    }}
                </Query>
                <Mutation mutation={MutationPostImages}
                          refetchQueries={[{query: QueryGetImages}]}
                >
                    {(mutation, {error}) => {
                        return <div id="upload-image" className="pure-u-1 form-box">
                            <div className="l-box">
                                <h2 className="l-box">Upload a Photo</h2>
                                <form onSubmit={this.uploadImage(mutation)}>
                                    <input type="file"
                                           name="file"
                                           placeholder="Photo from your computer"
                                           accept="image/*"
                                           required={true}
                                           onChange={this.onFileChange}
                                    />
                                    <button type="submit"
                                            className="pure-button pure-button-primary"
                                    >
                                        アップロード
                                    </button>
                                </form>
                                {error ? <p>{error.message}</p> : <p/>}
                            </div>
                        </div>
                    }}
                </Mutation>
            </div>
        );
    }

    private uploadImage(mutation: MutationFn) {
        return (event: FormEvent) => {
            event.preventDefault();
            const uploadFile = this.state.uploadFile!;
            const id = uuid();
            const ext = uploadFile.type.split("/")[1];
            const file = {
                bucket: aws_exports.aws_user_files_s3_bucket,
                key: `public/${id}.${ext}`,
                localUri: uploadFile,
                mimeType: uploadFile.type,
                region: aws_exports.aws_user_files_s3_bucket_region,
            };

            mutation({variables: {file}});
        }
    }

    private onFileChange(event: ChangeEvent<HTMLInputElement>) {
        const uploadFile = event.target.files![0];
        this.setState({uploadFile})
    }
}

export default Home;