<template>
    <Container>
        <!--<Header>Header</Header>-->
        <Main>
            <Row>
                <Col :span="24"
                     style="height: 300px;overflow: auto;padding: 3px;text-align: left;/*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)*/">
                    <div v-for="item in im_list" v-bind:key="item.ts">
                        <div>{{item.content}}</div>
                    </div>
                </Col>
                <Col :span="24" style="margin: 5px 0px;">
                    <Col :span="3" style="margin: 5px 0px;">
                        <Input v-model="uid" type="number" min="1" max="1000" placeholder="我的ID"></Input>
                    </Col>
                    <Col :span="3" style="margin: 5px 0px;">
                        <Input v-model="receiver" type="number" min="1" max="1000" placeholder="对方ID"></Input>
                    </Col>
                    <Col :span="8" style="margin: 5px 0px;">
                        <Input v-model="text_content" @keyup.enter.native="send_im_msg" placeholder="请输入内容,回车发送消息"></Input>
                    </Col>
                    <Col :span="10" style="margin-top: 6px;">
                        <div style="padding-left: 5px;text-align: left;">
                            <!--<Button type="primary" @click="send_im_msg"><span style="font-size: larger;">Send</span></Button>
                            <Button type="primary" @click="clear"><span style="font-size: larger;">Clear</span></Button>
                            <Button type="primary">
                                <a href="https://juejin.im/post/5dac651451882529d1528e12" target="_blank" style="font-size: larger;">Jump</a>
                            </Button>-->
                            <Button type="" size="small" @click="initWebSocket"><span style="">Connect</span></Button>
                            <Button type="" size="small" @click="disconnect"><span style="">Close</span></Button>
                            <Button type="" size="small" @click="send_im_msg"><span style="">Send</span></Button>
                            <Button type="" size="small" @click="clear"><span style="">Clear</span></Button>
                            <!--<Button type="" size="small">
                                <a href="https://juejin.im/post/5dac651451882529d1528e12" target="_blank" style="font-size: larger;">Jump</a>
                            </Button>-->
                        </div>
                    </Col>

                    <!--<div style="margin: 5px 0px;">
                        <Input v-model="account" placeholder="account"></Input>
                        <Input v-model="password" placeholder="password"></Input>
                        <Button type="primary" @click="login"><span style="font-size: larger;">登录</span></Button>
                        <Button type="primary" @click="connection"><span style="font-size: larger;">连接</span></Button>
                    </div>-->
                </Col>
            </Row>
        </Main>
        <!--<Footer>Footer</Footer>-->
    </Container>
</template>

<script src="./im.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

</style>
